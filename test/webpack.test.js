describe('options', () => {

    it('context path must be absolute', compile({
        context: __dirname + '/fixtures/other',
        entry: './app.js'
    }).then(function ({logs}, files) {
        expect(logs.files).toEqual(['/bundle.js']);
        expect(files['/bundle.js']).toMatch(`version`);
    }));


    describe('entry', () => {
        it('single', compile('./cats.js').then(function ({logs}, files) {
            expect(logs.files).toEqual(['/bundle.js']);
            expect(files['/bundle.js']).toMatch(`['mimi']`);
        }));

        it('single entry with multi chunk files', compile(['./cats.js', './foo.js']).then(function ({logs}, files) {
            expect(logs.files).toEqual(['/bundle.js']);
            let source = files['/bundle.js'];
            expect(source).toMatch(`['mimi']`);
            expect(source).toMatch(`bar`);
        }));

        it('multi', compile({
            entry: {
                cat1: './cats.js',
                cat2: './cats.js'
            },
            output: {filename: '[name].js'}
        }).then(function ({logs}, files) {
            expect(logs.files.length).toEqual(2);
            expect(files['/cat1.js']).toEqual(files['/cat2.js']);
        }));
    });


    describe('output', () => {
        it('path', compile({entry: './cats.js', output: {path: 'dist'}}).then(function ({logs}, files) {
            expect(logs.mkdirp).toEqual(['dist']);
        }));

        it('filename', compile({entry: './cats.js', output: {filename: 'cats.dist.js'}}).then(function ({logs}, files) {
            expect(logs.files).toEqual(['/cats.dist.js']);
            expect(files['/cats.dist.js']).toMatch(`['mimi']`);
        }));

        it('chunkFilename', compile({
            entry: './chunk.js',
            output: {chunkFilename: '[name].bundle.js'}
        }).then(({logs}, files) => {
            expect(logs.files).toEqual(['/bundle.js', '/1.bundle.js']);
            expect(files['/bundle.js']).not.toMatch('bar');
            expect(files['/1.bundle.js']).toMatch('bar');
        }));

        it('pathinfo', compile({entry: './cats.js', output: {pathinfo: true}}).then(function ({logs}, files) {
            expect(logs.files).toEqual(['/bundle.js']);
            expect(files['/bundle.js']).toMatch(/__webpack_require__\(\/\*! \.\/lib \*\//);
        }));

        it('library & libraryTarget', compile({
            entry: {cats: './cats.js'},
            output: {library: '[name]', libraryTarget: 'this'}
        }).then(function ({logs}, files) {
            expect(logs.files).toEqual(['/bundle.js']);
            expect(files['/bundle.js']).toMatch(/this\["cats"\]/);
        }));
    });

    describe('module', () => {
        it('loaders', compile({
            entry: './es5.js',
            module: {loaders: [{loader: 'babel'}]}
        }).then(function (_, files) {
            expect(files['/bundle.js']).toMatch(`bar`);
        }));

        it('noParse', compile({
            entry: './es5.js',
            module: {
                loaders: [{loader: 'babel'}],
                noParse: /es5\.js/
            }
        }).then(function (_, files) {
            expect(files['/bundle.js']).not.toMatch(`bar`);
        }));
    });
});