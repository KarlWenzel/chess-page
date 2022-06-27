const allLines = [
	'1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3',
	'1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3',
	'1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Nc3',
	'1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nf3 5.Nc3',
	'1.e4 e5 2.Nf3 Nc6 3.Bb5',
	'1.e4 e5 2.Nf3 Nc6 3.d4',
	'1.e4 e5 2.Nf3 Nc6 3.Bc4',
	'1.e4 e5 2.Nf3 Nf6',
	'1.e4 e5 2.Nf3 d6'
];

const startLine = '1.e4';
const chess = new Chess();

const getNextLines = (currentLine) => {	
	const nextMoveNumber = currentLine.split(' ').length + 1;
	
	const nextLines = allLines
		.filter((x) => x.startsWith(currentLine) && x.split(' ').length >= nextMoveNumber)
		.map((x) => x.split(' ').slice(0, nextMoveNumber).join(' '));
		
	return [...new Set(nextLines)];	
};

const makeBoardId = (pgn) => 'board-' + pgn.replaceAll('.', '').replaceAll(' ','-');

const makeBoard = (pgn) => {
	const boardName = makeBoardId(pgn);
	
	chess.load_pgn(pgn);
	const fen = chess.fen();
	
	return Chessboard(boardName, { showNotation: false, position: fen});
};

const setBoardClickEvents = (pgn) => {
	const id = makeBoardId(pgn);
	const $el = $('#' + id);
	
	$el.click((self) => {
		makeNextRow(pgn);
	});
};

const makeNextRow = (currentLine) => {
	const nextLines = getNextLines(currentLine);
	
	// make and add the DOM first
	
	let html = '<div class="moveOptionsRow">';
	for (i in nextLines) {
		let line = nextLines[i];
		html = html 
			+ '<div>'
			+ `<div id="${makeBoardId(line)}" style="width:256px;"></div>`
			+ `<p>${line}</p>`
			+ '</div>';
	}
	html = html + '</div>'
	
	$('#rowContainer').append($(html));
	
	// now render the boards and add the events
	
	for (i in nextLines) {
		let line = nextLines[i];
		makeBoard(line);
		setBoardClickEvents(line);
	}
};

$(document).ready(() => {
	const board = makeBoard(startLine);
	console.log('#' + makeBoardId(startLine));
	$('#' + makeBoardId(startLine)).click(() => {
		makeNextRow(startLine);
	});
});