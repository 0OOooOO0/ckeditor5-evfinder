import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class EVFinderAddImageCommand extends Command {

	execute( options ) {
		const editor = this.editor;
		const doc = editor.document;
		const batch = options.batch || doc.batch();
		const url = options.url;
		const selection = doc.selection;

		doc.enqueueChanges( () => {
			url.forEach((urlelem, idx) => {
				const imageElement = new ModelElement( 'image', {
					src: urlelem
				} );

				let insertAtSelection;

				if ( options.insertAt ) {
					insertAtSelection = new ModelSelection( [ new ModelRange( options.insertAt ) ] );
				} else {
					insertAtSelection = doc.selection;
				}

				// need to get the next position, otherwise will replace the last image
				if (insertAtSelection._ranges.length != 0) {
					insertAtSelection._ranges[0].start.path[0] += idx;
				}

				editor.data.insertContent( imageElement, insertAtSelection, batch );

				// Inserting an image might've failed due to schema regulations.
				if ( imageElement.parent ) {
					selection.setRanges( [ ModelRange.createOn( imageElement ) ] );
				}
			});
		});
	}
}
