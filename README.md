# **Remob**

A React Framework targeted at v16.13.1.
Aims to centralize ErrorHandler, One Store per Module, Hooks in Mobx, Decorators

Dependencies

-   React@16.13.1
-   React-DOM@16.13.1
-   Mobx@4.3.1
-   Mobx-React-Lite@2.2.2

# Documentation

The documentation is separated into 3 main concepts

-   **[Modular Design](./docs/modular-design.md)**
-   **[Framework Entry Point](./docs/framework-entry-point.md)**
-   **Utilities**
    -   **[Network Module](./docs/utils/network.md)**
    -   **[Remob Util](./docs/utils/remob-util.md)**
    -   **[React Hooks](./docs/utils/react-hooks.md)**
    -   **[Useful Decorators](./docs/utils/decorators.md)**

# Folder Structure

```bash
.
├── component                 # Reusable Components
├── module                    # Consider a Page
│   ├── main                  # Root Container of your App
│   │   ├── Main              # Component Folder
│   │   │   └── index.(jsx|tsx)        # UI Component ( Mainly contains "react-router-dom" related components )
│   │   ├── index.(js|ts)              # Business Logic / Mobx Store
│   │   └── hooks.(js|ts)              # React Hooks for store and business logic
│   ├── kyc                   # kyc related module
│   │   ├── kycPersonal              # KYC Personal Module
│   │   │   └── ...                    # File Structure is same as above
│   │   └── kycCorporate             # KYC Corporate Module
│   │       └── ...                    # File Structure is same as above
│   ├── subAccount            # sub-account related module
│   │   ├── overview                 # Overview Module
│   │   │   └── ...                    # File Structure is same as above
│   │   └── batchAdd                 # Batch Add Module
│   │       └── ...                    # File Structure is same as above
│   └── ...                   # Other similar modules
├── utils                     # Utilities
│   ├── decorators                     # Possible Decorators
│   ├── service                        # API Calls
│   └── ...                            # Other useful Utils
└── index.(js|ts)             # Application entry point
```

# Test

```bash
> yarn install
> yarn start
# Webpack Dev Server at https://localhost:8080
```
