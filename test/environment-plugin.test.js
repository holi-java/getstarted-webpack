/**
 * Created by holi on 3/4/17.
 */
import webpack from 'webpack';

describe('expose process.env into `bundle.js`', () => {
    it('environment exists', () => {
        expect(process.env.APP_ENV).toBe('dev');
    });

    it('replace environment variables', compile({
        entry: './env.js',
        plugins: [
            new webpack.EnvironmentPlugin(Object.keys(process.env))
        ]

    }).then(({log}, files) => {
        expect(files['/bundle.js']).toMatch(/(["'])dev\1/);
    }));
});