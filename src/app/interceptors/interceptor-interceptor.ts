import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, tap, shareReplay, catchError, of } from 'rxjs';
import { RegisterService } from '../services/register/register';


export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const service = inject(RegisterService);

  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  const now = Math.floor(Date.now() / 1000);

  if (req.url.includes('/token/refresh/')) {
    return next(req);
  }

  if (!access) {
    return next(req);
  }

  const decodedAccess: any = jwtDecode(access);

  if (decodedAccess.exp > now) {
    localStorage.setItem("id", decodedAccess.user_id)
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` }
    });
    return next(authReq);
  }
  if (refresh) {
    const decodedRefresh: any = jwtDecode(refresh);
    if (decodedRefresh.exp > now) {
      return http.post<{ access: string }>("http://127.0.0.1:8000/api/token/refresh/", { refresh }).pipe(
        switchMap(response => {
          localStorage.setItem("access", response.access);
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${response.access}` }
          });
          return next(cloned);
        })
      );
    } else {
      localStorage.clear()
      return next(req)
    }

  }
  else {
    return next(req)
  }
};
