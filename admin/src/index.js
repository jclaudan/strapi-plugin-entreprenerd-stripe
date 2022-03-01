import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
// import lifecycles from './lifecycles';
import PluginIcon from './components/PluginIcon';


const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
// const icon = pluginPkg.strapi.icon;
const name = pluginPkg.strapi.name;

const plugin = {
  // blockerComponent: null,
  // blockerComponentProps: {},
  description: pluginDescription,
  // icon,
  id: pluginId,
  initializer: Initializer,
  // injectedComponents: [],
  isReady: false,
  isRequired: pluginPkg.strapi.required || false,
  // layout: null,
  // lifecycles,
  name,
  // preventComponentRendering: false,
  // menu: {
  //   pluginsSectionLinks: [
  //     {
  //       destination: `/plugins/${pluginId}`,
  //       icon,
  //       label: {
  //         id: `${pluginId}.plugin.name`,
  //         defaultMessage: name,
  //       },
  //       name,
  //       permissions: [
  //         // Uncomment to set the permissions of the plugin here
  //         // {
  //         //   action: '', // the action name should be plugins::plugin-name.actionType
  //         //   subject: null,
  //         // },
  //       ],
  //     },
  //   ],
  // },
};



// ---------------------------------------
// Language: javascript

// import { prefixPluginTranslations } from "@strapi/helper-plugin";
// import pluginPkg from "../../package.json";
// import pluginId from "./pluginId";
// import Initializer from "./components/Initializer";
// import scheduler from "./components/scheduler";
// import dateReducers from "./hooks/reducers";

// const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(
            /* webpackChunkName: "[request]" */ './pages/HomePage'
        )

        return component
      },
      permissions: [
          // Uncomment to set the permissions of the plugin here
          // {
          //   action: '', // the action name should be plugin::plugin-name.actionType
          //   subject: null,
          // },
      ],
    })

    app.registerPlugin(plugin);
  },

  bootstrap(app) {
  //   app.injectContentManagerComponent("editView", "informations", {
  //   name,
  //   Component: HomePage,
  // });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
