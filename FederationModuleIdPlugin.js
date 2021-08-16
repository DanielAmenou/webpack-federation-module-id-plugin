const PLUGIN_NAME = "FederationModuleIdPlugin"

const extensionRegex = /\.[^/.]+$/

class FederationModuleIdPlugin {
  constructor() {}

  apply(compiler) {
    const context = compiler.options.context
    const federationPlugin = compiler.options.plugins && compiler.options.plugins.find((plugin) => plugin.constructor.name === "ModuleFederationPlugin")
    if (!federationPlugin) throw new Error("No ModuleFederationPlugin found.")
    const exposes = federationPlugin._options.exposes || {}

    const appName = federationPlugin._options.name
    const exposesModules = Object.values(exposes).map((module) => module.import || module)
    const modulesNamesMap = Object.fromEntries(Object.entries(exposes).map(([k, v]) => [v, k.replace("./", "")]))

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.beforeModuleIds.tap(PLUGIN_NAME, (modules) => {
        const chunkGraph = compilation.chunkGraph
        for (const module of modules) {
          const originalId = module.libIdent && module.libIdent({context})
          if (!originalId) continue
          const moduleId = originalId.replace(extensionRegex, "")
          if (exposesModules.includes(moduleId)) {
            const moduleName = modulesNamesMap[moduleId]
            chunkGraph.setModuleId(module, `webpack/container/remote/${appName}/${moduleName}`)
          }
        }
      })
    })
  }
}

module.exports = FederationModuleIdPlugin
