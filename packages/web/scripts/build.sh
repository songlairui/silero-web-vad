#!/usr/bin/env bash

# rm -rf dist
# mkdir dist
# pkgroll --clean-dist
# npx tsc
cp ../../silero_vad.onnx dist
# tsup src/worklet.js --bundle --format esm,cjs,iife
# npx webpack -c webpack.config.worklet.js
# npx webpack -c webpack.config.index.js
