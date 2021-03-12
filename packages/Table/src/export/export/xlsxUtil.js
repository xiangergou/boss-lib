/**
 * 单元格种类
 */
var XlsxCellType = {
	0 : 'TypeString',
	1 : 'TypeFormula',
	2 : 'TypeNumeric',
	3 : 'TypeBool',
	4 : 'TypeInline',
	5 : 'TypeError',
	6 : 'TypeDate',
	7 : 'TypeGeneral',
};

/**
 * 单元格数字格式
 */
var XlsxNumFmt = {
	0 : 'general',
	1 : '0',
	2 : '0.00',
	3 : '#,##0',
	4 : '#,##0.00',
	9 : '0%',
	10 : '0.00%',
	11 : '0.00e+00',
	12 : '# ?/?',
	13 : '# ??/??',
	14 : 'mm-dd-yy',
	15 : 'd-mmm-yy',
	16 : 'd-mmm',
	17 : 'mmm-yy',
	18 : 'h:mm am/pm',
	19 : 'h:mm:ss am/pm',
	20 : 'h:mm',
	21 : 'h:mm:ss',
	22 : 'm/d/yy h:mm',
	37 : '#,##0 ;(#,##0)',
	38 : '#,##0 ;[red](#,##0)',
	39 : '#,##0.00;(#,##0.00)',
	40 : '#,##0.00;[red](#,##0.00)',
	41 : '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)',
	42 : '_("$"* #,##0_);_("$* (#,##0);_("$"* "-"_);_(@_)',
	43 : '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)',
	44 : '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)',
	45 : 'mm:ss',
	46 : '[h]:mm:ss',
	47 : 'mmss.0',
	48 : '##0.0e+0',
	49 : '@'
};

/**
 * 单元内容水平位置
 */
var XlsxHAlign = {
	0 : 'general',
	1 : 'center',
	2 : 'left',
	3 : 'right'
};

/**
 * 单元内容垂直位置
 */
var XlsxVAlign = {
	0 : 'general',
	1 : 'center',
	2 : 'top',
	3 : 'bottom'
};

var XlsxBorderStyle = {
	0 : 'none',
	1 : 'thin', // 细的
	2 : 'medium', // 中等
	3 : 'thick', // 粗的
	4 : 'dashed',// 虚线
	5 : 'dotted',// 点连线
	6 : 'double' // 双层线
};

// var XlsxDefaults = {
// fileName: undefined, 文件名
// tableId: undefined, 表格ID
// isOnlyHead: false, 是否只导表头
// titlename: undefined, 标题
// agencyname: undefined, 预算单位
// unit: undefined, 金额单位（填写中文单位计量）
// isDataIndex : undefined 是否只导入表体tr中含有data-index属性的
// }

var fieldCols = new Array();
var isModel = false;
function createXlsx(XlsxDefaults) {
    fieldCols = new Array();
    if(XlsxDefaults['isModel'] != undefined){
        isModel = XlsxDefaults['isModel'];
    }else{
        isModel = false;
    }
	var tableId = '';
	if (!XlsxDefaults.hasOwnProperty("tableId") || !XlsxDefaults.tableId) {
		toastr.warning("无表格ID");
		return;
	}
	//公开表下载使用
    if(XlsxDefaults.hasOwnProperty("jx")|| typeof XlsxDefaults.jx!="undefined"){
        if((XlsxDefaults.hasOwnProperty("isNeedLoad")|| typeof XlsxDefaults.isNeedLoad!="undefined")&&XlsxDefaults.isNeedLoad==true){
            isNeedLoad=true;
        }
        return createXlsxByJX(XlsxDefaults)
    }

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var fileName = "导出" + year + month + day;
	if (XlsxDefaults.hasOwnProperty("fileName") && XlsxDefaults.fileName) {
		fileName = XlsxDefaults.fileName;
	}
	var isOnlyHead = false;
	if (XlsxDefaults.hasOwnProperty("isOnlyHead")
			&& (XlsxDefaults.isOnlyHead == true || XlsxDefaults.isOnlyHead == 'true')) {
		isOnlyHead = true;
	}
	var file = new xlsx.File();
	var sheet = file.addSheet(fileName);
	var $table = $("#" + XlsxDefaults.tableId);
	// 创建表头
	var thead = $table.find("thead");
	var htrs = $(thead).find("tr");
	// 创建标题及副标题
	var sr = 0;
	if ((XlsxDefaults['titlename'] || XlsxDefaults['agencyname'] || XlsxDefaults['unit'])
			&& htrs.length > 0) {
		// 所有<th>标题
		var tr_th = {};
		// 获取<th>标题
		for (var i = 0; i < htrs.length; i++) {
			tr_th[i] = $(htrs[i]).find("th");
		}

		// 计算需要的单元格数量
		var allCol = 0;
		for (var i = 0; i < tr_th[0].length; i++) {
			var $th = $(tr_th[0][i]);
			if ($th.hasClass('bs-checkbox')||$th.data("field") == 'detailicon'||$th.hasClass('service-checkbox')) {// 跳过复选框和单选框
				continue;
			}
			var colnum = parseInt($th.attr("colspan") ? $th.attr("colspan") : 0);
			if (colnum) {
				allCol += colnum;
			} else {
				allCol += 1;
			}
		}

		if (XlsxDefaults['titlename']) {
			var row = sheet.addRow();
			row.setHeightCM(1);
			sr += 1;
			for (var i = 0; i < allCol; i++) {
				var cell = row.addCell();
				cell.style.align = {
					indent : 0,
					shrinkToFit : false,
					textRotation : 0,
					wrapText : false,
					h : XlsxHAlign[1],
					v : XlsxVAlign[1]
				};
				cell.style.font = {
					color : "FF000000",
					bold : true,
					family : 0,
					charset : 0,
					italic : false,
					underline : false,
					size : 12,
					name : 'Verdana'
				};
			}
			var cell0 = row.cells[0];
			cell0.value = XlsxDefaults['titlename'];
			cell0.hMerge = allCol - 1;
			cell0.vMerge = 1 - 1;
		}
		if (XlsxDefaults['agencyname'] || XlsxDefaults['unit']) {
			var row = sheet.addRow();
			sr += 1;
			var align = Math.floor(allCol / 2);
			for (var i = 0; i < allCol; i++) {
				var cell = row.addCell();
				if (i < align) {
					cell.style.align = {
						indent : 0,
						shrinkToFit : false,
						textRotation : 0,
						wrapText : false,
						h : XlsxHAlign[2],
						v : XlsxVAlign[1]
					};
				} else {
					cell.style.align = {
						indent : 0,
						shrinkToFit : false,
						textRotation : 0,
						wrapText : false,
						h : XlsxHAlign[3],
						v : XlsxVAlign[1]
					};
				}
				cell.style.font = {
					color : "FF000000",
					bold : true,
					family : 0,
					charset : 0,
					italic : false,
					underline : false,
					size : 12,
					name : 'Verdana'
				};
			}
			var cell0 = row.cells[0];
			cell0.value = XlsxDefaults['agencyname'] ? "预算单位："
					+ XlsxDefaults['agencyname'] : "";
			cell0.hMerge = align - 1;
			cell0.vMerge = 1 - 1;

			var cell1 = row.cells[align];
			cell1.value = XlsxDefaults['unit'] ? XlsxDefaults['unit'] : "";
			cell1.hMerge = allCol - align - 1;
			cell1.vMerge = 1 - 1;
		}
	}

	var checkboxindex = -1;
	// 创建表头
	// var thead = $table.find("thead");
	// var htrs = $(thead).find("tr");
	if (htrs.length > 0) {
		// 所有<th>标题
		var tr_th = {};

		// 记录每行标题位置
		var align = {};

		// 记录标题行数
		var allr = 0;

		// 获取<th>标题
		for (var i = 0; i < htrs.length; i++) {
			var row = sheet.addRow();
			tr_th[i] = $(htrs[i]).find("th");
			align[i] = 0;
			allr += 1;
		}

		// 计算需要的单元格数量
		var allCol = 0;
		for (var i = 0; i < tr_th[0].length; i++) {
			var $th = $(tr_th[0][i]);
			if ($th.hasClass('bs-checkbox')||$th.data("field") == 'detailicon'||$th.hasClass('service-checkbox')) {// 跳过复选框和单选框
				checkboxindex = i;
				continue;
			}
			var colnum = parseInt($th.attr("colspan") ? $th.attr("colspan") : 0);
			if (colnum) {
				allCol += colnum;
			} else {
				allCol += 1;
			}
		}

		// 创建所有标题行
		for (var j = 0; j < htrs.length; j++) {
			for (var i = 0; i < allCol; i++) {
				var js = j + sr;
				var cell = sheet.rows[js].addCell();
				setXlsxTitleCellStyle(cell);
			}
		}

		// 初始行数
		var rnum = 0;

		// 记录所有已使用列数
		var curcol = [];
		// 从初始行开始创建标题
		for (var i = 0; i < tr_th[rnum].length; i++) {
			var $th = $(tr_th[0][i]);
			if ($th.hasClass('bs-checkbox')||$th.data("field") == 'detailicon'||$th.hasClass('service-checkbox')) {// 跳过复选框和单选框
				continue;
			}
			// 记录底级数
			var lnum = [];
			createXlsxTitle(tr_th, sheet, align, allr, rnum, i, curcol, lnum,
					sr);
		}

	}

	if(isOnlyHead && isModel){
        var row = sheet.addRow();
        for (var v = 0; v < fieldCols.length; v++) {
            var cell = row.addCell();
            cell.value = '['+fieldCols[v]+']';
            cell.style.border = {
                left : XlsxBorderStyle[1],
                right : XlsxBorderStyle[1],
                top : XlsxBorderStyle[1],
                bottom : XlsxBorderStyle[1],
                leftColor : "FF000000",
                rightColor : "FF000000",
                topColor : "FF000000",
                bottomColor : "FF000000"
            };
        }
	}

	// 创建表体
	if (!isOnlyHead&&!XlsxDefaults['cfgrow']) {
		var tbody = $table.find("tbody");
		// 小计行
		var subtotal = $table.parent().siblings('.fixed-table-subtotal');
		var subtbody = $(subtotal).find("tbody");
		var subtr = $(subtbody).find("tr");
		if (subtr.length > 0) {
			var bsnum = 0;
			var tds = $(subtr[0]).find("td");
			if (tds.length > 0) {
				var row = sheet.addRow();
				for (var v = 0; v < tds.length; v++) {
					var $td = $(tds[v]);
					if (checkboxindex == v) {// 跳过复选框和单选框
						bsnum += 1;
						continue;
					}
					var cell = row.addCell();
					var h = 0;
					// 是否去掉空格
					var text;
					if(XlsxDefaults['trim']){
						text= nonStr($($td.find("strong")[0]).text());
					}else{
					    text = nonStr($($td.find("strong")[0]).text()).trim();
					}
					//
					var type = isNaN(parseFloat(text)) ? 'text' : 'number';
					text = nonStr($($td.find("div")[0]).text()).trim();
					var numFmt = '';
					var cellType = XlsxCellType[0];
					switch (type.toLowerCase()) {
					case 'number':
						h = 3;
						if (text) {
							numFmt = XlsxNumFmt[0];
							cellType = XlsxCellType[2];
							if (text.lastIndexOf(".") > -1
									&& text.lastIndexOf(".") == text.length - 3) {
								numFmt = XlsxNumFmt[4];
								text = text.replaceAll(',', '');
							}
							text = parseFloat(text);
						}
						break;
					case 'date':
						h = 3;
						break;
					default:
						h = 0;
						break;
					}
					cell.value = text;
					cell.numFmt = numFmt;
					cell.cellType = cellType;
					if (sheet.col(v - bsnum)['width']
							&& sheet.col(v - bsnum).width < getXlsxColWidth(text)) {
						sheet.col(v - bsnum).width = getXlsxColWidth(text);
					}
					cell.style.border = {
						left : XlsxBorderStyle[1],
						right : XlsxBorderStyle[1],
						top : XlsxBorderStyle[1],
						bottom : XlsxBorderStyle[1],
						leftColor : "FF000000",
						rightColor : "FF000000",
						topColor : "FF000000",
						bottomColor : "FF000000"
					};
					cell.style.align = {
						indent : 0,
						shrinkToFit : false,
						textRotation : 0,
						wrapText : false,
						h : XlsxHAlign[h],
						v : XlsxVAlign[1]
					};
				}
			}
		}
		// 表体
        var btrs
		if(XlsxDefaults.onlySelected){
			if(!XlsxDefaults.isDataIndex || XlsxDefaults.isDataIndex==false){
				btrs= $(tbody).find("tr.selected");
			}else {
				btrs= $(tbody).find("tr.selected[data-index]");
			}
        }else{
			if(!XlsxDefaults.isDataIndex|| XlsxDefaults.isDataIndex==false){
				btrs= $(tbody).find("tr");
			}else {
				btrs= $(tbody).find("tr[data-index]");
			}
		}
		//
		if (btrs.length > 0) {
			for (var i = 0; i < btrs.length; i++) {
				var bsnum = 0;
				var row = sheet.addRow();
				var tds = $(btrs[i]).find("td");
				for (var v = 0; v < tds.length; v++) {
					var $td = $(tds[v]);
					if ($td.hasClass('bs-checkbox')||$td.find('.detail-icon').length==1||$td.hasClass('service-checkbox')) {// 跳过复选框和单选框
						bsnum += 1;
						continue;
					}
					var cell = row.addCell();
					var h = 0;
					var type = $td.attr('type') || $td.attr('data-type') || '';
					// 是否去掉空格
					var text;
					if(XlsxDefaults['trim']){
						text = nonStr($td.text());
					}else{
						text = nonStr($td.text()).trim();
					}
					//
					var numFmt = '';
					var cellType = XlsxCellType[0];
					switch (type.toLowerCase()) {
					case 'number':
						h = 3;
						if (text) {
							numFmt = XlsxNumFmt[0];
							cellType = XlsxCellType[2];
							if (text.lastIndexOf(".") > -1
									&& text.lastIndexOf(".") == text.length - 3) {
								numFmt = XlsxNumFmt[4];
								text = text.replaceAll(',', '');
							}
							text = parseFloat(text);
						}
						break;
					case 'date':
						h = 3;
						break;
					default:
						h = 0;
						break;
					}
					cell.value = text;
					cell.numFmt = numFmt;
					cell.cellType = cellType;
					if (sheet.col(v - bsnum)['width']
							&& sheet.col(v - bsnum).width < getXlsxColWidth(text)) {
						sheet.col(v - bsnum).width = getXlsxColWidth(text);
					}
					cell.style.border = {
						left : XlsxBorderStyle[1],
						right : XlsxBorderStyle[1],
						top : XlsxBorderStyle[1],
						bottom : XlsxBorderStyle[1],
						leftColor : "FF000000",
						rightColor : "FF000000",
						topColor : "FF000000",
						bottomColor : "FF000000"
					};
					cell.style.align = {
						indent : 0,
						shrinkToFit : false,
						textRotation : 0,
						wrapText : false,
						h : XlsxHAlign[h],
						v : XlsxVAlign[1]
					};
				}
			}
		}
	}
	// 行列固定表导出模板
	if (isOnlyHead&&XlsxDefaults['cfgrow']) {
		var tbody = $table.find("tbody");
		// 表体
        var btrs;
		if(XlsxDefaults.onlySelected){
			if(!XlsxDefaults.isDataIndex || XlsxDefaults.isDataIndex==false){
				btrs= $(tbody).find("tr.selected");
			}else {
				btrs= $(tbody).find("tr.selected[data-index]");
			}
        }else{
			if(!XlsxDefaults.isDataIndex|| XlsxDefaults.isDataIndex==false){
				btrs= $(tbody).find("tr");
			}else {
				btrs= $(tbody).find("tr[data-index]");
			}
		}
		//
		if (btrs.length > 0) {
			for (var i = 0; i < btrs.length; i++) {
				var bsnum = 0;
				var row = sheet.addRow();
				var tds = $(btrs[i]).find("td");
				for (var v = 0; v < tds.length; v++) {
					var $td = $(tds[v]);
					if ($td.hasClass('bs-checkbox')||$td.find('.detail-icon').length==1||$td.hasClass('service-checkbox')) {// 跳过复选框和单选框
						bsnum += 1;
						continue;
					}
					var cell = row.addCell();
					var h = 0;
					var type = $td.attr('type') || $td.attr('data-type') || '';
					// 是否去掉空格
					var text;
					if(XlsxDefaults['trim']){
						text = nonStr($td.text());
					}else{
						text = nonStr($td.text()).trim();
					}
					//
					var numFmt = '';
					var cellType = XlsxCellType[0];
					switch (type.toLowerCase()) {
					case 'number':
						h = 3;
						if (text) {
							numFmt = XlsxNumFmt[0];
							cellType = XlsxCellType[2];
							if (text.lastIndexOf(".") > -1
									&& text.lastIndexOf(".") == text.length - 3) {
								numFmt = XlsxNumFmt[4];
								text = text.replaceAll(',', '');
							}
							text = parseFloat(text);
						}
						break;
					case 'date':
						h = 3;
						break;
					default:
						h = 0;
						break;
					}
					var field=sheet.col(v - bsnum)['field'];
					if(field&&field.indexOf("itemname")==-1&&field!="rowno"){
						text="";
					}
					cell.value = text;
					cell.numFmt = numFmt;
					cell.cellType = cellType;
					if (sheet.col(v - bsnum)['width']
							&& sheet.col(v - bsnum).width < getXlsxColWidth(text)) {
						sheet.col(v - bsnum).width = getXlsxColWidth(text);
					}
					cell.style.border = {
						left : XlsxBorderStyle[1],
						right : XlsxBorderStyle[1],
						top : XlsxBorderStyle[1],
						bottom : XlsxBorderStyle[1],
						leftColor : "FF000000",
						rightColor : "FF000000",
						topColor : "FF000000",
						bottomColor : "FF000000"
					};
					cell.style.align = {
						indent : 0,
						shrinkToFit : false,
						textRotation : 0,
						wrapText : false,
						h : XlsxHAlign[h],
						v : XlsxVAlign[1]
					};
				}
			}
		}
	}
	
	
	file.saveAs('blob').then(function(content) {
		saveAs(content, fileName + ".xlsx");
	});
}

// 创建表头
function createXlsxTitle(allThObj, sheet, align, rowsnum, rowmun, colnum,
		curcol, leafnum, titlenum) {
	var cell0 = sheet.rows[rowmun + titlenum].cells[curcol.length];
	var th = allThObj[rowmun][colnum];
	var text = $(th).text().trim();
	if ($(th).data("field") == 'rowno') {
		text = '序号';
	}
	cell0.value = text;
	var rowspan = parseInt($(th).attr("rowspan") ? $(th).attr("rowspan") : "1");
	var colspan = parseInt($(th).attr("colspan") ? $(th).attr("colspan") : "1");
	cell0.vMerge = rowspan - 1;
	align[rowmun] += 1;
	// 下一行数
	var nextrownum = rowmun + 1;
	// 最后一行数
	var endrownum = rowsnum - 1;
	// 当前行到最后一行还差的行数
	var resrownum = rowsnum - rowmun;
	// 如果[合并行数]<[当前行到最后一行还差的行数] 并且 当前行不是最后一行
	if (rowspan < resrownum && rowmun != endrownum) {
		cell0.hMerge = colspan - 1;
		if (allThObj.hasOwnProperty(nextrownum)) {
			var startAlign = align[nextrownum];
			var endAlign = startAlign + colspan;
			var ss = [];
			for (var v = startAlign; v < endAlign; v++) {
				var s = ss.length + startAlign;
				if (s < endAlign) {
					createXlsxTitle(allThObj, sheet, align, rowsnum,
							nextrownum, v, curcol, ss, titlenum);
				}
			}
			for (var i = 0; i < ss.length; i++) {
				leafnum.push(1);
			}
		}
	} else {
		if (sheet.col(curcol.length)['width']
				&& sheet.col(curcol.length).width < getXlsxColWidth(text)) {
			sheet.col(curcol.length).width = getXlsxColWidth(text);
		} else {
			sheet.col(curcol.length).width = getXlsxColWidth(text);
		}
		//设置当前列字段名
		sheet.col(curcol.length).field=$(th).attr("data-field");
		//
		curcol.push(1);
		leafnum.push(1);
		fieldCols.push($(th).data("field"));
	}
}

function getXlsxColWidth(text) {
	if (text.length < 5) {
		return 20;
	}
	return text.length * 2;
}

function setXlsxTitleCellStyle(cell) {
	cell.style.border = {
		left : XlsxBorderStyle[1],
		right : XlsxBorderStyle[1],
		top : XlsxBorderStyle[1],
		bottom : XlsxBorderStyle[1],
		leftColor : "FF000000",
		rightColor : "FF000000",
		topColor : "FF000000",
		bottomColor : "FF000000"
	};
	cell.style.align = {
		indent : 0,
		shrinkToFit : false,
		textRotation : 0,
		wrapText : false,
		h : XlsxHAlign[1],
		v : XlsxVAlign[1]
	};
	cell.style.font = {
		color : "FF000000",
		bold : true,
		family : 0,
		charset : 0,
		italic : false,
		underline : false,
		size : 12,
		name : 'Verdana'
	};
	cell.style.fill = {
		bgColor : 'ffffffff',
		fgColor : 'ffD2E9FF',
		patternType : 'solid',
	};
}

function download() {
	var XlsxDefaults = {
		fileName : "sssssss",
		tableId : "addTable",
	};
	createXlsx(XlsxDefaults);
}

function createXlsxByJX(XlsxDefaults) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var fileName = "导出" + year + month + day;
    if (XlsxDefaults.hasOwnProperty("fileName") && XlsxDefaults.fileName) {
        fileName = XlsxDefaults.fileName;
    }
    var isOnlyHead = false;
    if (XlsxDefaults.hasOwnProperty("isOnlyHead")
        && (XlsxDefaults.isOnlyHead == true || XlsxDefaults.isOnlyHead == 'true')) {
        isOnlyHead = true;
    }
    var file = new xlsx.File();
    var $table = $(XlsxDefaults.tableId);
    for(var t=0;t< $table.length;t++){
        var item=$table[t];
        var sheet = file.addSheet(fileName+t);
        // 创建表头
        var thead = $(item).find("tbody");
        var htrs = $(thead).find("tr");
        // 创建标题及副标题
        var sr = 0;
        if ((XlsxDefaults['titlename'] || XlsxDefaults['agencyname'] || XlsxDefaults['unit']||XlsxDefaults['no'])
            && htrs.length > 0) {
            // 所有<th>标题
            var tr_th = {};
            // 获取<th>标题
            for (var i = 0; i < htrs.length; i++) {
                tr_th[i] = $(htrs[i]).find("td");
            }

            // 计算需要的单元格数量
            var allCol = 0;
            for (var i = 0; i < tr_th[0].length; i++) {
                var $th = $(tr_th[0][i]);
                if ($th.hasClass('bs-checkbox')||$th.data("field") == 'detailicon'||$th.hasClass('service-checkbox')) {// 跳过复选框和单选框
                    continue;
                }
                var colnum = parseInt($th.attr("colspan") ? $th.attr("colspan") : 0);
                if (colnum) {
                    allCol += colnum;
                } else {
                    allCol += 1;
                }
            }
            if (XlsxDefaults['no']) {
                var row = sheet.addRow();
                row.setHeightCM(1);
                sr += 1;
                for (var i = 0; i < allCol; i++) {
                    var cell = row.addCell();
                    cell.style.align = {
                        indent : 0,
                        shrinkToFit : false,
                        textRotation : 0,
                        wrapText : false,
                        h : XlsxHAlign[2],
                        v : XlsxVAlign[1]
                    };
                    cell.style.font = {
                        color : "FF000000",
                        bold : true,
                        family : 0,
                        charset : 0,
                        italic : false,
                        underline : false,
                        size : 9,
                        name : '宋体'
                    };
                }
                var cell0 = row.cells[0];
                //绩效表特殊处理 表标题置顶
                if(t==0){
                    cell0.value = XlsxDefaults['no'];
                }else{
                    cell0.value = "";
                }
                //
                cell0.hMerge = allCol - 1;
                cell0.vMerge = 1 - 1;
            }
            if (XlsxDefaults['titlename']) {
                var row = sheet.addRow();
                row.setHeightCM(1);
                sr += 1;
                for (var i = 0; i < allCol; i++) {
                    var cell = row.addCell();
                    cell.style.align = {
                        indent : 0,
                        shrinkToFit : false,
                        textRotation : 0,
                        wrapText : false,
                        h : XlsxHAlign[1],
                        v : XlsxVAlign[1]
                    };
                    cell.style.font = {
                        color : "FF000000",
                        bold : true,
                        family : 0,
                        charset : 0,
                        italic : false,
                        underline : false,
                        size : 19,
                        name : '宋体'
                    };
                }
                var cell0 = row.cells[0];
                //绩效表特殊处理 表标题置顶
                if(t==0){
                    cell0.value = XlsxDefaults['titlename'];
                }else{
                    cell0.value = "";
                }
                //
                cell0.hMerge = allCol - 1;
                cell0.vMerge = 1 - 1;
            }
            if (XlsxDefaults['agencyname'] || XlsxDefaults['unit']) {
                var row = sheet.addRow();
                sr += 1;
                var align = Math.floor(allCol / 2);
                for (var i = 0; i < allCol; i++) {
                    var cell = row.addCell();
                    if (i < align) {
                        cell.style.align = {
                            indent : 0,
                            shrinkToFit : false,
                            textRotation : 0,
                            wrapText : false,
                            h : XlsxHAlign[2],
                            v : XlsxVAlign[1]
                        };
                    } else {
                        cell.style.align = {
                            indent : 0,
                            shrinkToFit : false,
                            textRotation : 0,
                            wrapText : false,
                            h : XlsxHAlign[3],
                            v : XlsxVAlign[1]
                        };
                    }
                    cell.style.font = {
                        color : "FF000000",
                        bold : true,
                        family : 0,
                        charset : 0,
                        italic : false,
                        underline : false,
                        size : 9,
                        name : '宋体'
                    };
                }
                var cell0 = row.cells[0];


                cell0.hMerge = align - 1;
                cell0.vMerge = 1 - 1;

                var cell1 = row.cells[align];
                if(t==0){
                    cell0.value = XlsxDefaults['agencyname'] ? "预算单位："
                        + XlsxDefaults['agencyname'] : "";
                    cell1.value = XlsxDefaults['unit'] ? XlsxDefaults['unit'] : "";
                }else{
                    cell0.value = "";
                    cell1.value="";
                }

                cell1.hMerge = allCol - align - 1;
                cell1.vMerge = 1 - 1;
            }
        }

        var checkboxindex = -1;
        // 创建表头
        // var thead = $table.find("thead");
        // var htrs = $(thead).find("tr");
        if (htrs.length > 0) {
            // 所有<th>标题
            var tr_th = {};

            // 记录每行标题位置
            var align = {};

            // 记录标题行数
            var allr = 0;

            // 获取<th>标题
            for (var i = 0; i < htrs.length; i++) {
                var row = sheet.addRow();
                tr_th[i] = $(htrs[i]).find("td");
                align[i] = 0;
                allr += 1;
            }

            // 计算需要的单元格数量
            var allCol = 0;
            for (var i = 0; i < tr_th[0].length; i++) {
                var $th = $(tr_th[0][i]);
                if ($th.hasClass('bs-checkbox')||$th.data("field") == 'detailicon'||$th.hasClass('service-checkbox')) {// 跳过复选框和单选框
                    checkboxindex = i;
                    continue;
                }
                var colnum = parseInt($th.attr("colspan") ? $th.attr("colspan") : 0);
                if (colnum) {
                    allCol += colnum;
                } else {
                    allCol += 1;
                }
            }
            // 创建所有标题行
            for (var j = 0; j < htrs.length; j++) {
                for (var i = 0; i < allCol; i++) {
                    var js = j + sr;
                    //var cell_tds=htrs[j].cells;
                    var align_left=1;
                    // if(i<cell_tds.length){
                    // 	var align_=cell_tds[i]['align'];
                    // 	if(align_&&align_=='left'){
                    // 		align_left=2;
                    // 	}
                    // }
                    var cell = sheet.rows[js].addCell();
                    setXlsxTitleCellStyleByJx(cell,align_left);
                }
            }

            // 初始行数
            var rnum = 0;

            // 记录所有已使用列数
            var curcol = [];
            // 从初始行开始创建标题
            headMapCache={};
            isNoend=true;
            headMapCacheIndex={};
            headMapCache1={};
            for (var i = 0; i < tr_th[rnum].length; i++) {
                var $th = $(tr_th[0][i]);
                if ($th.hasClass('bs-checkbox')||$th.data("field") == 'detailicon'||$th.hasClass('service-checkbox')) {// 跳过复选框和单选框
                    continue;
                }
                // 记录底级数
                var colspan = parseInt( $th.attr("colspan") ?  $th.attr("colspan") : "1");
                var lnum = [];
                createXlsxTitleByJX(tr_th, sheet, align, allr, rnum, i, curcol, lnum,
                    sr,XlsxDefaults);
            }
            var lastmap  = headMapCache[sheet.rows.length-4];
            lastmap[-1]=1;
            for (var i = 0; i < tr_th[sheet.rows.length-4].length; i++) {//最后一行特殊处理
                var index = lastmap[i-1];
                var cell0 =  sheet.rows[sheet.rows.length-1].cells[index]
                var th = tr_th[sheet.rows.length-4][i];
                var text = $(th).text().trim();
                cell0.value = text;
                var rowspan = parseInt($(th).attr("rowspan") ? $(th).attr("rowspan") : "1");
                var colspan = parseInt($(th).attr("colspan") ? $(th).attr("colspan") : "1");
                cell0.vMerge = rowspan - 1;
                cell0.hMerge = colspan - 1;
            }

        }

        if(isOnlyHead && isModel){
            var row = sheet.addRow();
            for (var v = 0; v < fieldCols.length; v++) {
                var cell = row.addCell();
                cell.value = '['+fieldCols[v]+']';
                cell.style.border = {
                    left : XlsxBorderStyle[1],
                    right : XlsxBorderStyle[1],
                    top : XlsxBorderStyle[1],
                    bottom : XlsxBorderStyle[1],
                    leftColor : "FFFFFF",
                    rightColor : "FFFFFF",
                    topColor : "FFFFFF",
                    bottomColor : "FFFFFF"
                };
            }
        }
    }

    // doSave(file)
    file.saveAs('blob').then(function(content) {
        upload(new File([content],"excel_pdf_"+uuid()),XlsxDefaults)
        //saveAs(content, fileName + ".xlsx");
    });

    // upload(file)w
}

function fileUploadCallBackByJX() {

    setTimeout(function () {
        attachSign();
    }, 2000);
    coverHide();
}




