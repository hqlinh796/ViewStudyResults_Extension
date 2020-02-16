

function getResult(document) {
    const sheet = document.getElementById('tbDiemThiGK').lastChild;
    let trNode = sheet.firstChild;
    let subject = {};
    while (trNode) {
        let i = 0;
        let node = trNode.firstChild;
        let isPush = true;
        let title = "";
        while (node) {
            if (node.nodeType == Node.ELEMENT_NODE) {
                
                switch (i) {
                    case 1:
                        title = node.innerText;
                        if (!isOptionalSubject(title)){
                            //not exist subject
                            if (!subject[title])
                                subject[title] = {};
                            isPush = true;
                        }
                        else{
                            isPush = false;
                        }    
                        break;
                    case 2:
                        subject[title].credit = parseInt(node.innerText) || 0;
                        break;
                    case 3:
                        subject[title].class = node.innerText;
                        break;
                    case 4:
                        subject[title].code = node.innerText;
                        break;
                    case 5:
                        
                        subject[title].mark = parseFloat(node.innerText) || 0;
                        
                        if (parseFloat(node.innerText) < 5 || !parseFloat(node.innerText)){
                            subject[title].mark = 0;
                            subject[title].credit = 0;
                        }
                        break;
                    case 6:
                        subject[title].note = node.innerText;
                        break;
                    default:
                        isPush = true;
                        break;
                }
                if (!isPush)
                    break;
                i++;
            }
            node = node.nextSibling;
        }
        trNode = trNode.nextSibling;
    }
    console.log(subject);
    let result = computeMarkAndCredit(subject);
    result.year = getYear();
    result.semester = result.year == "--Tất cả--" ? "" : getSemester();
    
    return result;
}

getYear = () => document.getElementById("ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB").value;
    
getSemester = () => parseInt(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiSIS").value) + 1;

function isOptionalSubject(title){
    if (title.toLowerCase().indexOf("anh văn") != -1)
        return true;
    if (title.toLowerCase().indexOf("quốc phòng") != -1)
        return true;
    if (title.toLowerCase().indexOf("thể dục") != -1)
        return true;
    return false;
}

function computeMarkAndCredit(subjects){
    let totalCredits = 0, totalMark = 0;
    Object.keys(subjects).forEach(key => {
        totalCredits += subjects[key].credit;
        totalMark += subjects[key].mark * subjects[key].credit;
    })
    return {GPA: totalMark/totalCredits, totalCredits: totalCredits};
}


chrome.runtime.sendMessage({
    action: "getSource",
    source: getResult(document)
});