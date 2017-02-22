import HtmlWebpackPlugin from 'html-webpack-plugin';

function compileWith(options = {}) {
    return compile({
        entry: {cats: './cats', foo: './chunk'},
        output: {filename: '[name].dist.js', chunkFilename: '[name].dist.js'},
        plugins: [new HtmlWebpackPlugin(options)]
    });
}


test(`generate default 'index.html' with all entries & chunk files in body with script tag`, (done) => {
    compileWith().then(({logs}, files) => {
        expect(logs.files).toEqual(['/cats.dist.js', '/foo.dist.js', '/2.dist.js', '/index.html']);
        let html = files['/index.html'];
        expect(html).toEqual(expect.stringContaining(`<title>Webpack App</title>`));
        expect(html).toEqual(expect.stringContaining(`src="cats.dist.js"`));
        expect(html).toEqual(expect.stringContaining(`src="foo.dist.js"`));
        expect(html).not.toEqual(expect.stringContaining(`src="2.dist.js"`));
        expect(files['/2.dist.js']).toEqual(expect.stringContaining('./foo.js'));
        done();
    });
});

test(`custom page title`, (done) => {
    compileWith({title: 'foo'}).then(({logs}, files) => {
        let html = files['/index.html'];
        expect(html).toEqual(expect.stringContaining(`<title>foo</title>`));
        done();
    });
});

test(`custom filename to saving generated html`, (done) => {
    compileWith({filename: 'foo.html'}).then(({logs}, files) => {
        expect(logs.files).toContain('/foo.html');
        done();
    });
});


test(`using template to generate html`, (done) => {
    compileWith({template: 'template.html'}).then(({logs}, files) => {
        let html = files['/index.html'];
        expect(html).toEqual(expect.stringContaining(`http-equiv="author"`));
        expect(html).toEqual(expect.stringContaining(`src="cats.dist.js"`));
        expect(html).toEqual(expect.stringContaining(`src="foo.dist.js"`));
        expect(html).not.toEqual(expect.stringContaining(`src="2.dist.js"`));
        done();
    });
});


test(`add some chunks scripts files`, (done) => {
    let options = {
        chunks:['cats']
    };
    compileWith(options).then(({logs}, files) => {
        expect(logs.files).toEqual(['/cats.dist.js', '/foo.dist.js', '/2.dist.js', '/index.html']);
        let html = files['/index.html'];
        expect(html).toEqual(expect.stringContaining(`src="cats.dist.js"`));
        expect(html).not.toEqual(expect.stringContaining(`src="foo.dist.js"`));
        expect(html).not.toEqual(expect.stringContaining(`src="2.dist.js"`));
        done();
    });
});