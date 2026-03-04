import {isDevMode} from '@angular/core';
import {environment as environmentDev} from '../environments/environment.development';
import {environment} from '../environments/environment';

export const baseUrl = (isDevMode() ? environmentDev.baseUrl : environment.baseUrl);
