import { Buffer } from 'buffer';
import 'zone.js'; // Included with Angular CLI.
import * as process from 'process';

(window as any).global = window;
(window as any).global.Buffer = Buffer;
(window as any).process = process;
