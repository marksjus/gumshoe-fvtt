/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as IndexImport } from "./routes/index"
import { Route as InvestigatorSettingsCardsIndexImport } from "./routes/investigator/settings/cards/index"

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const InvestigatorSettingsCardsIndexRoute =
  InvestigatorSettingsCardsIndexImport.update({
    path: "/investigator/settings/cards/",
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/investigator/settings/cards/": {
      id: "/investigator/settings/cards/"
      path: "/investigator/settings/cards"
      fullPath: "/investigator/settings/cards"
      preLoaderRoute: typeof InvestigatorSettingsCardsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  InvestigatorSettingsCardsIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/investigator/settings/cards/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/investigator/settings/cards/": {
      "filePath": "investigator/settings/cards/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
