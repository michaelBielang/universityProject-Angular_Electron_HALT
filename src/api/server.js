define("server-env", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const port = 8787;
    const mode = 'dev';
    const baseUrl = 'localhost';
    exports.default = {
        port: port,
        mode: mode,
        url: baseUrl,
    };
});
define("controlers/user.controler", ["require", "exports", "winston"], function (require, exports, winston) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const logger = winston.createLogger({
        transports: [
            new (winston.transports.Console)({ level: 'info' }),
            new (winston.transports.File)({ filename: 'user-controler.log', level: 'error' }),
        ],
    });
    function user_index(req, res, next) {
        res.status(200).json({
            message: 'Retrieved users',
        });
    }
    exports.user_index = user_index;
    function user_show(req, res, next) {
        res.status(200).json({
            message: 'Retrieved user' + req.params.userid,
        });
    }
    exports.user_show = user_show;
    function user_create(req, res, next) {
        res.status(200).json({
            message: 'Created user',
        });
    }
    exports.user_create = user_create;
    function user_update(req, res, next) {
        res.status(200).json({
            message: 'Updated user' + req.params.userid,
        });
    }
    exports.user_update = user_update;
    function user_delete(req, res, next) {
        res.status(200).json({
            message: 'Deleted user' + req.params.userid,
        });
    }
    exports.user_delete = user_delete;
});
define("routes/users", ["require", "exports", "express", "controlers/user.controler"], function (require, exports, express, user_controler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UsersRoutes {
        constructor() {
            this.express = express();
            this.mountRoutes();
        }
        mountRoutes() {
            const userRoutes = express.Router();
            userRoutes.get('/', user_controler_1.user_index);
            userRoutes.get('/:userid', user_controler_1.user_show);
            userRoutes.post('/', user_controler_1.user_create);
            userRoutes.patch('/:userid', user_controler_1.user_update);
            userRoutes.delete('/:userid', user_controler_1.user_delete);
            this.express.use('/', userRoutes);
        }
        getExpressRef() {
            return this.express;
        }
    }
    exports.default = new UsersRoutes().express;
});
define("api", ["require", "exports", "express", "morgan", "body-parser", "server-env", "routes/users"], function (require, exports, express, logger, bodyParser, server_env_1, users_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Api {
        constructor() {
            this.express = express();
            this.addMiddlewares();
            this.mountSubRoutes();
            this.mountApiRoutes();
            this.errorRoutes();
        }
        addMiddlewares() {
            if (server_env_1.default.mode === 'dev') {
                this.express.use(logger('dev'));
            }
            this.express.use(bodyParser.urlencoded({ extended: false }));
            this.express.use(bodyParser.json());
        }
        mountSubRoutes() {
            this.express.use('/api/users', users_1.default);
        }
        mountApiRoutes() {
            const apiRoutes = express.Router();
            apiRoutes.get('/api/', (req, res) => {
                res.json({
                    message: 'Welcome, this is an API for the Hochschul Active Directory Lookup Tool',
                });
            });
            this.express.use('/', apiRoutes);
        }
        errorRoutes() {
            this.express.use((req, res, next) => {
                const error = new Error('Route not available');
                error.status = 404;
                next(error);
            });
            this.express.use((error, req, res, next) => {
                res.status(error.status || 500);
                res.json({
                    error: {
                        message: error.message,
                    }
                });
            });
        }
        getExpressRef() {
            return this.express;
        }
    }
    exports.default = new Api().getExpressRef();
});
define("server", ["require", "exports", "path", "api", "server-env", "winston"], function (require, exports, path, api_1, server_env_2, winston) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.info('Server testing');
    const logger = winston.createLogger({
        transports: [
            new (winston.transports.Console)({ level: 'info' }),
            new (winston.transports.File)({ filename: path.join(__dirname, 'logging/api-server.log'), level: 'error' }),
        ],
    });
    api_1.default.listen(server_env_2.default.port, (err) => {
        if (err) {
            return logger.error(err);
        }
        return logger.info(`server is listening on ${server_env_2.default.port} in \'${server_env_2.default.mode}\' mode`);
    });
});
//# sourceMappingURL=server.js.map