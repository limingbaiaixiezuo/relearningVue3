import { isPromise } from './validate';

export function callInterceptor(
  interceptor,
  {args = [], done, canceled}
) {
  if (interceptor) {
    const result = interceptor.apply(null, args);

    if (isPromise(result)) {
      result.then(value => {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(() => {});
    } else if (result) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
