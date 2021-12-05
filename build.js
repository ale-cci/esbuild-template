#!/usr/bin/env node
import esbuild from 'esbuild'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {sassPlugin} from 'esbuild-sass-plugin'
import http from 'http'

const buildOptions = {
  entryPoints: {
    'js/index': './src/js/index.js',
    'css/style': './src/css/style.scss',
  },
  bundle: true,
  sourcemap: true,
  outdir: 'public/',
  color: true,
  target: 'es5',
  minify: true,
  plugins: [
    sassPlugin()
  ]
}


; (function main() {
  const args = (
    yargs(hideBin(process.argv))
    .command('build', 'build the js and css files')
    .command('serve', 'serve the builded application and public directory')
    .help()
    .demandCommand(1)
    .strict()
    .parse()
  )

  const [cmd] = args._
  switch (cmd) {
    case 'build': build(); break;
    case 'serve': serve(); break;
  }
})()


async function build() {
  const result = await esbuild.build(buildOptions)
  const text = await esbuild.analyzeMetafile(result.metafile, {verbose: true})
  console.log(text)
}

async function serve() {
  function onRequest({method, path, status, timeInMS}) {
    console.log(` \x1b[33m [${method}] \x1b[0m (${status}) ${path}`)
  }
  const {host, port} = await esbuild.serve({
    onRequest: onRequest,
    servedir: 'public',
  }, {
    ...buildOptions,
    banner: {
      js: ' (() => new EventSource("http://localhost:8082").onmessage = () => location.reload())();',
    },
  })

  console.log(`Server ready on http://${host}:${port}`)
}
