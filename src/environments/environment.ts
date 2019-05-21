// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const baseUrl = 'http://devns.5spower.com/';

/*export const environment = {
  production: true,
  oidcServerUrl: 'http://testsi.5spower.com/',
  thisSiteUrl: 'http://localhost:4200/',
  webApiBaseUrl: 'http://devns.5spower.com/',
  appStoreApi: baseUrl + 'appstoreapi/',
  sellerContractApi: baseUrl + 'scontractapi/',
  sellerEnergyPurchaseApi: baseUrl + 'sepurchaseapi/',
  sellerCRMApi: baseUrl + 'scrmapi/',
  sellerSettlementApi: baseUrl + 'ssettlementapi/',
  sellerRiskApi: baseUrl + 'sriskapi/',
  sellerUserProfileApi: baseUrl + 'suprofileapi/',
  uploadRoot: 'http://devns.5spower.com/',

};*/

/* export const environment = {
  production: false,
  oidcServerUrl: 'http://devsi.5spower.com/',
  thisSiteUrl: 'http://localhost:4200/',
  webApiBaseUrl: baseUrl,
  appStoreApi: baseUrl + 'appstoreapi/',
  sellerContractApi: baseUrl + 'scontractapi/',
  sellerEnergyPurchaseApi: baseUrl + 'sepurchaseapi/',
  sellerSettlementApi: baseUrl + 'ssettlementapi/',
  sellerRiskApi: baseUrl + 'sriskapi/',
  sellerUserProfileApi: baseUrl + 'suprofileapi/',
  sellerCRMApi: baseUrl + 'scrmapi/', // 'http://10.96.227.253:5000/',//
  uploadRoot: '111/',
}; */

export const environment = {
  production: true,
  oidcServerUrl: 'http://testsi.5spower.com/',
  thisSiteUrl: 'http://localhost:4200/',
  webApiBaseUrl: 'http://testns.5spower.com/',
  appStoreApi: baseUrl + 'appstoreapi/',
  sellerContractApi: baseUrl + 'scontractapi/',
  sellerEnergyPurchaseApi: baseUrl + 'sepurchaseapi/',
  sellerCRMApi: baseUrl + 'scrmapi/',
  sellerSettlementApi: baseUrl + 'ssettlementapi/',
  sellerRiskApi: baseUrl + 'sriskapi/',
  sellerUserProfileApi: baseUrl + 'suprofileapi/',
  uploadRoot: 'http://testns.5spower.com/',

};