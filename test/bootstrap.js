import webpack, {WebpackOptionsDefaulter} from 'webpack';
import path from 'path';
function optional(options) {
    options = typeof options == 'string' || options.__proto__.constructor == Array ? {entry: options} : options;
    options = Object.assign({context: path.join(__dirname, 'fixtures')}, options);
    let noOutputPath = !options.output || !options.output.path;
    new WebpackOptionsDefaulter().process(options);
    if (noOutputPath) options.output.path = "/";
    options.output.pathinfo = true;
    return options;
}
function compiler(options) {
    let c = Object.assign(webpack(options), {
        logs: {mkdirp: [], files: []},
        files: {},
        outputFileSystem: {
            join: function () {
                return [].join.call(arguments, "/").replace(/\/+/g, "/");
            },
            mkdirp: function (path, callback) {
                c.logs.mkdirp.push(path);
                callback();
            },
            writeFile: function (name, content, callback) {
                c.logs.files.push(name);
                c.files[name] = content.toString("utf-8");
                callback();
            }
        }
    });

    c.plugin("compilation", function (compilation) {
        compilation.bail = true;
    });
    return c;
}

export function compile(options) {
    let c = compiler(optional(options));
    return {
        then: function (resolve) {
            let error = {};
            c.run(function (err, stats) {
                if (err) {
                    resolve({error: err});
                    return;
                }
                let compilation = stats.compilation;
                stats = stats.toJson({
                    modules: true,
                    reasons: true
                });
                if (stats.errors.length > 0) {
                    resolve({error: stats.errors});
                    return;
                }
                stats.logs = c.logs;
                resolve(stats, c.files, compilation);
            });
        }
    };
}

if (global) global.compile = compile;