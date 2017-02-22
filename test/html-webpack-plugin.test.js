import HtmlWebpackPlugin from 'html-webpack-plugin';
describe('html-webpack-plugin', () => {


    function compileWith(options = {}) {
        return compile({
            entry: {cats: './cats', foo: './chunk'},
            output: {filename: '[name].dist.js', chunkFilename: '[name].dist.js'},
            plugins: [new HtmlWebpackPlugin(options)]
        });
    }


    it(`generate default 'index.html' with all entries & chunk files in body with script tag`, compileWith().then(({logs}, files) => {
        expect(logs.files).toEqual(['/cats.dist.js', '/foo.dist.js', '/2.dist.js', '/index.html']);
        let html = files['/index.html'];
        expect(html).toMatch(`<title>Webpack App</title>`);
        expect(html).toMatch(`src="cats.dist.js"`);
        expect(html).toMatch(`src="foo.dist.js"`);
        expect(html).not.toMatch(`src="2.dist.js"`);
        expect(files['/2.dist.js']).toMatch('./foo.js');
    }));

    it(`custom page title`, compileWith({title: 'foo'}).then(({logs}, files) => {
        let html = files['/index.html'];
        expect(html).toMatch(`<title>foo</title>`);
    }));

    it(`custom filename to saving generated html`, compileWith({filename: 'foo.html'}).then(({logs}, files) => {
        expect(logs.files).toContain('/foo.html');
    }));


    it(`using template to generate html`, compileWith({template: 'template.html'}).then(({logs}, files) => {
        let html = files['/index.html'];
        expect(html).toMatch(`http-equiv="author"`);
        expect(html).toMatch(`src="cats.dist.js"`);
        expect(html).toMatch(`src="foo.dist.js"`);
        expect(html).not.toMatch(`src="2.dist.js"`);
    }));


    it(`add some chunks scripts files`, compileWith({chunks: ['cats']}).then(({logs}, files) => {
        expect(logs.files).toEqual(['/cats.dist.js', '/foo.dist.js', '/2.dist.js', '/index.html']);
        let html = files['/index.html'];
        expect(html).toMatch(`src="cats.dist.js"`);
        expect(html).not.toMatch(`src="foo.dist.js"`);
        expect(html).not.toMatch(`src="2.dist.js"`);
    }));
});