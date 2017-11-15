import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class EVFinderAddImageCommand extends Command {

	execute( options ) {
		const editor = this.editor;
		const doc = editor.document;
		const url = options.url;

		if (url && url.length) {
			const batch = options.batch || doc.batch();
			// const selection = doc.selection;
			url.forEach((urlelem, idx) => {
				// console.log('addImg', urlelem);
				doc.enqueueChanges( () => {
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
						insertAtSelection._ranges[0].start.path[0] = insertAtSelection._ranges[0].end.path[0];
					}

					editor.data.insertContent( imageElement, insertAtSelection, batch );

					// doc.selection.setRanges([ModelRange.createOn(imageElement)]);
					// doc.selection.moveFocusTo(doc.selection.getLastPosition(), 'end');

					// Inserting an image might've failed due to schema regulations.
					/* if ( imageElement.parent ) {
						selection.setRanges( [ ModelRange.createOn( imageElement ) ] );
						console.log('section', section);
					} */
				});
			});
		}
	}
}
