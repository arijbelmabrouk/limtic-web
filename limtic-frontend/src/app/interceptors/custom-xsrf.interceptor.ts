import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const customXsrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Lit le cookie XSRF-TOKEN manuellement
  const xsrfToken = getCookie('XSRF-TOKEN');

  // L'ajoute sur toutes les requêtes de mutation
  // même cross-origin (ce qu'Angular refuse de faire nativement)
  if (xsrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const cloned = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', xsrfToken)
    });
    return next(cloned);
  }

  return next(req);
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}