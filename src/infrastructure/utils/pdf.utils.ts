/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Source:
// https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js

const Canvas = require("canvas");
const assert = require("assert").strict;

function NodeCanvasFactory() { }
NodeCanvasFactory.prototype = {
	create: function NodeCanvasFactory_create(width: number, height: number) {
		assert(width > 0 && height > 0, "Invalid canvas size");
		const canvas = Canvas.createCanvas(width, height);
		const context = canvas.getContext("2d");
		return {
			canvas,
			context,
		};
	},

	reset: function NodeCanvasFactory_reset(canvasAndContext: any, width: number, height: number) {
		assert(canvasAndContext.canvas, "Canvas is not specified");
		assert(width > 0 && height > 0, "Invalid canvas size");
		canvasAndContext.canvas.width = width;
		canvasAndContext.canvas.height = height;
	},

	destroy: function NodeCanvasFactory_destroy(canvasAndContext: any) {
		assert(canvasAndContext.canvas, "Canvas is not specified");

		// Zeroing the width and height cause Firefox to release graphics
		// resources immediately, which can greatly reduce memory consumption.
		canvasAndContext.canvas.width = 0;
		canvasAndContext.canvas.height = 0;
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	},
};

const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");

// Some PDFs need external cmaps.
const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

import { InvalidPdfException } from "../exceptions/invalidPdf.exception";

// class
export class PdfUtils {

	public static async generateThumbnail(buffer: Buffer, scale: number = 1.0): Promise<Buffer> {
		let doc = undefined;
		try {
			doc = await pdfjsLib.getDocument({
				data: buffer,
				cMapUrl: CMAP_URL,
				cMapPacked: CMAP_PACKED,
			}).promise;
		}
		catch (error) {
			throw new InvalidPdfException(error.message);
		}

		const page = await doc.getPage(1);

		const viewport = page.getViewport({ scale: scale });

		// @ts-ignore
		const canvasFactory = new NodeCanvasFactory();
		const canvasAndContext = canvasFactory.create(
			viewport.width,
			viewport.height
		);
		const renderContext = {
			canvasContext: canvasAndContext.context,
			viewport,
			canvasFactory,
		};

		await page.render(renderContext).promise;
		const image = canvasAndContext.canvas.toBuffer();

		return image as Buffer;
	}

}
