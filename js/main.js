const allLines = [
	'1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3',
	'1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3',
	'1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Nc3',
	'1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3',
	'1.e4 e5 2.Nf3 Nc6 3.Bb5',
	'1.e4 e5 2.Nf3 Nc6 3.d4',
	'1.e4 e5 2.Nf3 Nc6 3.Bc4',
	'1.e4 e5 2.Nf3 Nf6',
	'1.e4 e5 2.Nf3 d6',	
	'1.e4 e6 2.d4',
	'1.e4 c6 2.d4',
	'1.e4 d6 2.d4',
	'1.e4 g6 2.d4',
	'1.e4 d5 2.exd5',
	'1.e4 Nf6 2.e5'
];

const lineNames = [
	{ line: '1.e4 c5', name: 'Sicilian' },
	{ line: '1.e4 e5 2.Nf3 Nc6 3.Bb5', name: 'Ruy Lopez' },
	{ line: '1.e4 e5 2.Nf3 Nc6 3.d4', name: ' Scotch Game' },
	{ line: '1.e4 e5 2.Nf3 Nc6 3.Bc4', name: 'Italian Game' },
	{ line: '1.e4 e5 2.Nf3 Nf6', name: 'Petrov\'s' },
	{ line: '1.e4 e5 2.Nf3 d6', name: 'Philidor\'s' },
	{ line: '1.e4 e6', name: 'French' },
	{ line: '1.e4 c6', name: 'Caro-Kahn' },
	{ line: '1.e4 d6', name: 'Pirc' },
	{ line: '1.e4 g6', name: 'Modern' },
	{ line: '1.e4 d5', name: 'Scandinavian' },
	{ line: '1.e4 Nf6', name: 'Alekhine\'s' }
]

const startLine = '1.e4';
const chess = new Chess();

const getNextLines = (currentLine) => {	
	const nextMoveNumber = currentLine ? currentLine.split(' ').length + 1 : 1;
	
	const nextLines = allLines
		.filter((x) => x.startsWith(currentLine) && x.split(' ').length >= nextMoveNumber)
		.map((x) => x.split(' ').slice(0, nextMoveNumber).join(' '));
		
	return [...new Set(nextLines)];	
};

const whoMovedLast = (pgn) => {
	const pgnArray = pgn.split(' ');
	const lastMove = pgnArray[pgnArray.length - 1];
	const isWhite = /\d+\..+/;
	return isWhite.test(lastMove) ? 'white' : 'black';
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
	
	$el.click(() => {
		$el.parent().parent().nextAll('.moveOptionsRow').remove();
		$el.parent().siblings('div.boardContainer').addClass('opacity-25');
		$el.parent().removeClass('opacity-25');
		makeNextRow(pgn);
		$('html, body').scrollTop($(document).height());
	});
};

const makeNextRow = (currentLine) => {
	const nextLines = getNextLines(currentLine);
	
	if (!nextLines.length) {
		return;
	}
	
	const moveNumber = nextLines[0].split(' ').length;
	const lastMoveColor = whoMovedLast(nextLines[0]);
	
	// make and add the DOM first
	
	let html = '<div class="moveOptionsRow">'
			 + `<div style="background:${lastMoveColor}"><h2 style="width:32px; text-align=justify;">${moveNumber}</h2></div>`;
	for (i in nextLines) {
		let line = nextLines[i];
		let lineNameObj = lineNames.filter((x) => x.line==line);
		let lineName = lineNameObj.length ? lineNameObj[0].name : "";
		html = html 
			+ '<div class="boardContainer">'
			+ `<div id="${makeBoardId(line)}" style="width:256px;"></div>`
			+ `<p style="width:256px;">${line} <b>${lineName}</b></p>`
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
	makeNextRow('');
});