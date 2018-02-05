var filelistObj;
$( document ).ready(function() {
    var fileInput = document.getElementById('fileinput');
    fileInput.addEventListener('change', function(e) {
        $(".filepick").hide();
        $(".fullrow").show();
        $(".table").show();
        filelistObj = e.target.files;
        for (var i=0; i<filelistObj.length; i++) {
            var baseFileType = filelistObj[i].type.split('/')[0];
            switch( baseFileType ) {
                case "text":
                    filelistObj[i].action = "Read";
                    break;
                case "audio":
                    filelistObj[i].action = "Listen";
                    break;
                case "video":
                    filelistObj[i].action = "Watch";
                    break;
                case "image":
                    filelistObj[i].action = "View";
                    break;
                default:
                    filelistObj[i].action = "-";
                    break;
            }
            var tableRow = drawTableRow(i, filelistObj[i].name, filelistObj[i].size, filelistObj[i].lastModifiedDate, filelistObj[i].type, filelistObj[i].action);
            $("tbody").append(tableRow);
        }
    });
    $("#tabletest").on("click", ".clickToReveal", function() {
        var currentFileObject = filelistObj[$(this).attr("data-index")];
        $(".dostuff__title").html($(this).attr("data-action") + ": "+currentFileObject.name.split('.')[0]);
        switch( $(this).attr("data-action") ) {
            case "Read":
                readAction(currentFileObject);
                break;
            case "Listen":
                audioAction(currentFileObject);
                break;
            case "Watch":
                watchAction(currentFileObject);
                break;
            case "View":
                photoAction(currentFileObject);
                break;
            default:
                console.log("error");
        }
    });
    $(".overlay").on("click", function() {
        $(".overlay").hide();
        $(".dostuff").hide();
        $('audio').trigger('pause');
        $('video').trigger('pause');
    })

    $("#searchInput").keyup(function () {
        var data = this.value.toUpperCase().split(" ");
        var foundEl = $("tbody").find("tr");
        if (this.value == "") {
            foundEl.show();
            return;
        }
        foundEl.hide();
        foundEl.filter(function (i, v) {
            for (var d = 0; d < data.length; ++d) {
                if ($(this).text().toUpperCase().indexOf(data[d]) > -1) {
                    return true;
                }
            }
            return false;
        })
        .show();
    });
});

$('select.themeselect').on('change', function() {
    $(".container").removeClass().addClass("container");
    switch (this.value) {
        case "red":
            $(".container").addClass("redtheme");
            break;
        case "green":
            $(".container").addClass("greentheme");
            break;
        case "blue":
            $(".container").addClass("bluetheme");
            break;
        case "purple":
            $(".container").addClass("purpletheme");
            break;
        default:
            break;
    }
})

// actions 
function audioAction(audioFile) {
    showModal();
    var getSrc = URL.createObjectURL(audioFile);
    $(".dostuff__body").html('<audio id="sound" src='+getSrc+' style="width:100%" controls></audio>');
}

function readAction(textFile) {
    showModal();
    var reader = new FileReader();
    reader.readAsText(textFile); 
    reader.onload = function(e) {
      $(".dostuff__body").html(reader.result);
    }
}

function watchAction(videoFile) {
    showModal();
    var getSrc = URL.createObjectURL(videoFile);
    var videoHTML = '<video width="100%" controls>\
        <source src="'+getSrc+'" type="video/mp4">\
        <source src="'+getSrc+'" type="video/ogg">\
        Your browser does not support the video tag.\
    </video>';
    $(".dostuff__body").html(videoHTML);
}

function photoAction(imgFile) {
    showModal();
    var getSrc = URL.createObjectURL(imgFile);
    $(".dostuff__body").html('<img src='+getSrc+' />');
}

// helper function to add commas to numbers (formatting)
function addCommas(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function showModal() {
    $(".overlay").show();
    $(".dostuff").show();
}

// dynamic table row creation
function drawTableRow(fileIndex, name, size, updatedAt, type, action) {
    var tablerowHTML = $("#tabletest tbody").append("\
      <tr>\
        <td class='strongname'>"+name+"</td>\
        <td>"+addCommas(size)+" bytes</td>\
        <td>"+updatedAt+"</td>\
        <td>"+type+"</td>\
        <td class='clickToReveal' data-index='"+fileIndex+"' data-action='"+action+"'>"+action+"</td>\
      </tr>\
      ");
    return tablerowHTML;
}

