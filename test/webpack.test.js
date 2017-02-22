describe('options', () => {

    it('context path must be absolute', (done) => {
        compile({context: __dirname + '/fixtures/other', entry: './app.js'}).then(function ({logs}, files) {
            expect(logs.files).toEqual(['/bundle.js']);
            expect(files['/bundle.js']).toEqual(expect.stringContaining(`version`));
            done();
        });
    });

    describe('entry', () => {
        it('single', (done) => {
            compile('./cats.js').then(function ({logs}, files) {
                expect(logs.files).toEqual(['/bundle.js']);
                expect(files['/bundle.js']).toEqual(expect.stringContaining(`['mimi']`));
                done();
            });
        });

        it('single entry with multi chunk files', (done) => {
            compile(['./cats.js', './foo.js']).then(function ({logs}, files) {
                expect(logs.files).toEqual(['/bundle.js']);
                let source = files['/bundle.js'];
                expect(source).toEqual(expect.stringContaining(`['mimi']`));
                expect(source).toEqual(expect.stringContaining(`bar`));
                done();
            });
        });

        it('multi', (done) => {
            const entry = {
                cat1: './cats.js',
                cat2: './cats.js'
            };
            compile({entry: entry, output: {filename: '[name].js'}}).then(function ({logs}, files) {
                expect(logs.files).toHaveLength(2);
                expect(files['/cat1.js']).toEqual(files['/cat2.js']);
                done();
            });
        });
    });


    describe('output', () => {
        it('path', (done) => {
            compile({entry: './cats.js', output: {path: 'dist'}}).then(function ({logs}, files) {
                expect(logs.mkdirp).toEqual(['dist']);
                done();
            });
        });

        it('filename', (done) => {
            compile({entry: './cats.js', output: {filename: 'cats.dist.js'}}).then(function ({logs}, files) {
                expect(logs.files).toEqual(['/cats.dist.js']);
                expect(files['/cats.dist.js']).toEqual(expect.stringContaining(`['mimi']`));
                done();
            });
        });

        it('chunkFilename', (done) => {
            compile({entry: './chunk.js', output: {chunkFilename: '[name].bundle.js'}}).then(({logs}, files) => {
                expect(logs.files).toEqual(['/bundle.js', '/1.bundle.js']);
                expect(files['/bundle.js']).not.toEqual(expect.stringContaining('bar'));
                expect(files['/1.bundle.js']).toEqual(expect.stringContaining('bar'));
                done();
            });
        });

        it('pathinfo', (done) => {
            compile({entry: './cats.js', output: {pathinfo: true}}).then(function ({logs}, files) {
                expect(logs.files).toEqual(['/bundle.js']);
                expect(files['/bundle.js']).toEqual(expect.stringContaining(`__webpack_require__(/*! ./lib */`));
                done();
            });
        });

        it('library & libraryTarget', (done) => {
            let options = {entry: {cats: './cats.js'}, output: {library: '[name]', libraryTarget: 'this'}};
            compile(options).then(function ({logs}, files) {
                expect(logs.files).toEqual(['/bundle.js']);
                expect(files['/bundle.js']).toEqual(expect.stringContaining(`this["cats"]`));
                done();
            });
        });
    });

    describe('module', () => {
        it('loaders', (done) => {
            let options = {
                entry: './es5.js',
                module: {
                    loaders: [
                        {loader: 'babel'}
                    ]
                }
            };
            compile(options).then(function (_, files) {
                expect(files['/bundle.js']).toEqual(expect.stringContaining(`bar`));
                done();
            });
        });

        it('noParse', (done) => {
            let options = {
                entry: './es5.js',
                module: {
                    loaders: [{loader: 'babel'}],
                    noParse: /es5\.js/
                }
            };
            compile(options).then(function (_, files) {
                expect(files['/bundle.js']).not.toEqual(expect.stringContaining(`bar`));
                done();
            });
        });
    });
});