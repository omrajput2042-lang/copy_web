
let data_time = [];
let data_longitude = [];
let data_latitude = [];
let data_speed = [];
let data_headingangle = [];
let data_accX = [];
let data_accY = [];
let data_accZ = [];
let data_accXg = [];
let data_accYg = [];
let data_accZg = [];
let data_rotationspeedX = [];
let data_rotationspeedY = [];
let data_rotationspeedZ = [];
let data_angleX = [];
let data_angleY = [];
let data_angleZ = [];
let data_time_seconds = [];
let data_altitude = [];
let data_timestamp = [];

let gpsIntervalId = null; // setInterval縺ｮID繧剃ｿ晄戟

function unlock(){
    // 襍ｷ蜍輔Ο繝�け縺ｮ蜿ら�繧剃ｽ懈�
    const toggleBtn = document.getElementById('toggleBtn');
    toggleBtn.textContent = 'pushed';

    var wakeLock = null;
    const canWakeLock = function(){
    return 'wakeLock' in navigator;
    }
    
    const setWakeLock = function () {
        if (!canWakeLock()) {
            console.error('Your browser is not support WakeLock API!');
            return;
        }
        if (wakeLock) {
            return;
        }
        navigator.wakeLock.request('screen').then(result => {
            wakeLock = result;
            toggleBtn.textContent = 'No Sleep Mode turned on';

            wakeLock.addEventListener('release', () => {
                wakeLock = null;
                toggleBtn.textContent = 'Sleep Mode turned on';    
            });
        }).catch((err) => {
            toggleBtn.textContent = 'Unlock failed';
        });
    };
    
    setWakeLock();
}



function playJS() {
    // const password = prompt("繝代せ繝ｯ繝ｼ繝峨ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞:");
    // const correctPassword = "A"; // 險ｭ螳壹＠縺溘ヱ繧ｹ繝ｯ繝ｼ繝�

    // if (password === correctPassword) {

        // GPS諠��ｱ縺ｮ蜿門ｾ�
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
            function(position) {
                const lat = position.coords.latitude.toFixed(6);
                const lon = position.coords.longitude.toFixed(6);
                const alt = position.coords.altitude.toFixed(2);
                const timestamp = position.timestamp;                
                document.getElementById("longitude").innerText = lon
                document.getElementById("latitude").innerText = lat
                document.getElementById("speed").innerText = Math.round(position.coords.speed * 3.6*100) / 100;
                document.getElementById("GPSorientation").innerText = Math.round(position.coords.heading * 100) / 100;
                document.getElementById("altitude").innerText = alt;
                document.getElementById("timestamp").innerText = timestamp;
            },
            function(error) {
                alert("菴咲ｽｮ諠��ｱ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆: " + error.message);
            },
            {
            enableHighAccuracy: true,
            }
            );
        } else {
            alert("Geolocation API縺ｯ繧ｵ繝昴�繝医＆繧後※縺�∪縺帙ｓ縲�");
        }


        if (DeviceMotionEvent.requestPermission && DeviceOrientationEvent.requestPermission) {
            Promise.all([
                DeviceMotionEvent.requestPermission(),
                DeviceOrientationEvent.requestPermission()
            ]).then(permissionStates => {
                if (permissionStates.every(state => state === "granted")) {
                    window.addEventListener("devicemotion", handleMotion);
                    window.addEventListener("deviceorientation", handleOrientation);
                    startUpdating();
                } else {
                    alert("繧ｻ繝ｳ繧ｵ繝ｼ縺ｮ繧｢繧ｯ繧ｻ繧ｹ縺梧拠蜷ｦ縺輔ｌ縺ｾ縺励◆");
                }
            }).catch(console.error);
        } else {
            window.addEventListener("devicemotion", handleMotion);
            window.addEventListener("deviceorientation", handleOrientation);
            startUpdating();
        }

        gpsIntervalId = setInterval(updateGPS, 10);

    // } else {
    //     alert("Wrong Password");
    //     window.location.href = "https://www.html-play.2-d.jp"; // 繝ｪ繝繧､繝ｬ繧ｯ繝�
    // }
}


function handleMotion(event) {
    document.getElementById("accX").innerText = event.acceleration.x?.toFixed(2);
    document.getElementById("accY").innerText = event.acceleration.y?.toFixed(2);
    document.getElementById("accZ").innerText = event.acceleration.z?.toFixed(2);

    document.getElementById("SpeedAlpha").innerText = event.rotationRate.alpha?.toFixed(2);
    document.getElementById("SpeedBeta").innerText = event.rotationRate.beta?.toFixed(2);
    document.getElementById("SpeedGamma").innerText = event.rotationRate.gamma?.toFixed(2);

    document.getElementById("accXG").innerText = event.accelerationIncludingGravity.x.toFixed(2);
    document.getElementById("accYG").innerText = event.accelerationIncludingGravity.y.toFixed(2);
    document.getElementById("accZG").innerText = event.accelerationIncludingGravity.z.toFixed(2);


}

function handleOrientation(event) {
    document.getElementById("AngleAlpha").innerText = event.alpha?.toFixed(2);
    document.getElementById("AngleBeta").innerText = event.beta?.toFixed(2);
    document.getElementById("AngleGamma").innerText = event.gamma?.toFixed(2);
}


function requestPermission() {
    if (DeviceMotionEvent.requestPermission && DeviceOrientationEvent.requestPermission) {
        Promise.all([
            DeviceMotionEvent.requestPermission(),
            DeviceOrientationEvent.requestPermission()
        ]).then(permissionStates => {
            if (permissionStates.every(state => state === "granted")) {
                window.addEventListener("devicemotion", handleMotion);
                window.addEventListener("deviceorientation", handleOrientation);
                startUpdating();
            } else {
                alert("繧ｻ繝ｳ繧ｵ繝ｼ縺ｮ繧｢繧ｯ繧ｻ繧ｹ縺梧拠蜷ｦ縺輔ｌ縺ｾ縺励◆");
            }
        }).catch(console.error);
    } else {
        window.addEventListener("devicemotion", handleMotion);
        window.addEventListener("deviceorientation", handleOrientation);
        startUpdating();
    }
}

function startUpdating() {
    setInterval(() => {
        if (window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", handleMotion);
        }
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleOrientation);
        }            
    }, 10);
}

function updateGPS() {
    const nowInMilliseconds = Date.now();
    const date = new Date(nowInMilliseconds);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 譛医�0縺九ｉ蟋九∪繧九◆繧√�+1縺励∪縺吶�
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;

    document.getElementById("datetime").innerText = formattedTime;

    let elements = document.getElementsByName('onoff');
    let len = elements.length;
    let checkValue = '';

    for (let i = 0; i < len; i++){
        if (elements.item(i).checked){
            checkValue = elements.item(i).value;
        }
    }

    if (checkValue=="onlog"){
        data_time_seconds.push(nowInMilliseconds);
        data_time.push(formattedTime);
        data_longitude.push(document.getElementById("longitude").innerText);
        data_latitude.push(document.getElementById("latitude").innerText);
        data_speed.push(document.getElementById("speed").innerText);
        data_headingangle.push(document.getElementById("GPSorientation").innerText);
        data_accX.push(document.getElementById("accX").innerText);
        data_accY.push(document.getElementById("accY").innerText);
        data_accZ.push(document.getElementById("accZ").innerText);
        data_accXg.push(document.getElementById("accXG").innerText);
        data_accYg.push(document.getElementById("accYG").innerText);
        data_accZg.push(document.getElementById("accZG").innerText);
        data_rotationspeedX.push(document.getElementById("SpeedAlpha").innerText);
        data_rotationspeedY.push(document.getElementById("SpeedBeta").innerText);
        data_rotationspeedZ.push(document.getElementById("SpeedGamma").innerText);
        data_angleX.push(document.getElementById("AngleAlpha").innerText);
        data_angleY.push(document.getElementById("AngleBeta").innerText);
        data_angleZ.push(document.getElementById("AngleGamma").innerText);
        data_altitude.push(document.getElementById("altitude").innerText);
        data_timestamp.push(document.getElementById("timestamp").innerText);

    }        
}

// // createtable螳溯｡御ｸｭ縺ｯ莉悶�蜃ｦ逅�ｒ荳譎ょ●豁｢
// function createtable(){
//     // 1. 險域ｸｬ蛛懈ｭ｢
//     if (gpsIntervalId !== null) {
//         clearInterval(gpsIntervalId);
//         gpsIntervalId = null;
//     }

//     // 2. 繝��繝悶Ν逕滓�
//     let html = '';
//     for (let i=0; i<data_time.length; i++){
//         html += `<tr>
//             <td>${data_time[i]}</td>
//             <td>${data_longitude[i]}</td>
//             <td>${data_latitude[i]}</td>
//             <td>${data_speed[i]}</td>
//             <td>${data_headingangle[i]}</td>
//             <td>${data_accX[i]}</td>
//             <td>${data_accY[i]}</td>
//             <td>${data_accZ[i]}</td>
//             <td>${data_accXg[i]}</td>
//             <td>${data_accYg[i]}</td>
//             <td>${data_accZg[i]}</td>
//             <td>${data_rotationspeedX[i]}</td>
//             <td>${data_rotationspeedY[i]}</td>
//             <td>${data_rotationspeedZ[i]}</td>
//             <td>${data_angleX[i]}</td>
//             <td>${data_angleY[i]}</td>
//             <td>${data_angleZ[i]}</td>
//             <td>${parseFloat(data_time_seconds[i]-data_time_seconds[0])/1000}</td>
//         </tr>`;
//     }
//     const table = document.getElementById("table");
//     const header = table.rows[0].outerHTML;
//     table.innerHTML = header + html;

//     // 3. 繝��繝悶Ν逕滓�蠕後↓蜀埼幕縺励◆縺��ｴ蜷医�荳玖ｨ倥ｒ譛牙柑蛹�
//     gpsIntervalId = setInterval(updateGPS, 100);
// }

function savecsv() {
    // 繝倥ャ繝繝ｼ陦�
    const headers = [
        "Date Time", "Longitude", "Latitude", "Speed km/h", "Heading angle",
        "Acc X m/sﾂｲ", "Acc Y m/sﾂｲ", "Acc Z m/sﾂｲ",
        "Acc with G X m/sﾂｲ", "Acc with G Y m/sﾂｲ", "Acc with G Z m/sﾂｲ",
        "Rotation speed ﾎｱ ﾂｰ/s", "Rotation speed ﾎｲ ﾂｰ/s", "Rotation speed ﾎｳ ﾂｰ/s",
        "Angle ﾎｱ ﾂｰ", "Angle ﾎｲ ﾂｰ", "Angle ﾎｳ ﾂｰ", "Elapsed Time [s]", "Altitude m", "GPS timestamp"
    ];

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += headers.join(",") + "\n";

    for (let i = 0; i < data_time.length; i++) {
        let row = [
            data_time[i],
            data_longitude[i],
            data_latitude[i],
            data_speed[i],
            data_headingangle[i],
            data_accX[i],
            data_accY[i],
            data_accZ[i],
            data_accXg[i],
            data_accYg[i],
            data_accZg[i],
            data_rotationspeedX[i],
            data_rotationspeedY[i],
            data_rotationspeedZ[i],
            data_angleX[i],
            data_angleY[i],
            data_angleZ[i],
            parseFloat(data_time_seconds[i] - data_time_seconds[0]) / 1000,
            data_altitude[i],
            data_timestamp[i]            
        ];
        csvContent += row.join(",") + "\n";
    }

    // 繝輔ぃ繧､繝ｫ蜷咲函謌�
    const now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day = String(now.getDate()).padStart(2, "0");
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");
    let samplingrate = "_100Hz"    
    let filename = `${year}${month}${day}${hours}${minutes}${seconds}${samplingrate}.csv`;

    // 繝繧ｦ繝ｳ繝ｭ繝ｼ繝牙�逅�
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

