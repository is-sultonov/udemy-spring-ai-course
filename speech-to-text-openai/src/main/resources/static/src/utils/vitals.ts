// Web Vitals monitoring for Core Web Vitals metrics

export function getCLS(onPerfEntry: (metric: any) => void) {
  import('web-vitals').then(({ getCLS }) => getCLS(onPerfEntry));
}

export function getFID(onPerfEntry: (metric: any) => void) {
  import('web-vitals').then(({ getFID }) => getFID(onPerfEntry));
}

export function getFCP(onPerfEntry: (metric: any) => void) {
  import('web-vitals').then(({ getFCP }) => getFCP(onPerfEntry));
}

export function getLCP(onPerfEntry: (metric: any) => void) {
  import('web-vitals').then(({ getLCP }) => getLCP(onPerfEntry));
}

export function getTTFB(onPerfEntry: (metric: any) => void) {
  import('web-vitals').then(({ getTTFB }) => getTTFB(onPerfEntry));
}