import { Endpoint } from "@ndn/endpoint";
import { AltUri, Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";


async function datapasien(evt) {
  evt.preventDefault();
  const prefix = new Name("/data/datapasien"); 
  const app = "Bagas";
  //const $button = document.querySelector("#app_datapasien");
  console.log(`test`);
  const endpoint = new Endpoint();
  const encoder = new TextEncoder(); //membuat const baru untuk fungsi TextEncoder
  const interest = new Interest();  //membuat const baru untuk fungsi Interest
  const decoder = new TextDecoder();

  interest.name = prefix; //membuat const baru untuk dari fungsi interest dan name
  interest.mustBeFresh = true; 
  interest.lifetime = 10000;
  interest.appParameters = encoder.encode(app); //melakukan encode packet ndn
  await interest.updateParamsDigest();

  const t0 = Date.now();
  const data = await endpoint.consume(interest);
  const rtt = Date.now() - t0;

  const dataContent = data.content;

  console.log(`${rtt} ms`);

  const listdata = decoder.decode(dataContent);
  console.log(listdata);
  const jsonData = JSON.parse(listdata);
  console.log(jsonData);

  const outputJsonElement = document.getElementById('output_json');
  outputJsonElement.textContent = JSON.stringify(jsonData, null, 2);
  
  // Menampilkan modal dengan data JSON saat tombol "Lihat Semua" ditekan
  //$('#myModal').modal('show');
  jQuery('#myModal').modal('show');


}




async function ping(evt) {
  evt.preventDefault();
  // Disable the submit button during function execution.
  const $button = document.querySelector("#app_button");
  $button.disabled = true;

  try {
    const prefix = new Name("/data/konsultasi");
    const nama = document.querySelector("#app_nama").value;
    //const umur = document.querySelector("#app_umur").value;
    //const sex = document.querySelector("#app_sex").value;
    const penyakit = document.querySelector("#app_penyakit").value;
    //const alamat = document.querySelector("#app_alamat").value;
    const hp = document.querySelector("#app_hp").value;
    //const ktp = document.querySelector("#app_ktp").value;
    //const goldar = document.querySelector("#app_goldar").value;
    //const $log = document.querySelector("#app_log");
    const jadwalkemo = document.querySelector("#app_jadwalkemo").value;
    const terakhirkemo = document.querySelector("#app_terakhirkemo").value;
    const jadwalkrio = document.querySelector("#app_jadwalkrio").value;
    const terakhirkrio = document.querySelector("#app_terakhirkemo").value;
    //$log.textContent = `Check Data \n${AltUri.ofName(prefix)}\n`;

    const endpoint = new Endpoint();
    const encoder = new TextEncoder();
    for (let i = 0; i < 1; ++i) {
      const interest = new Interest();
      interest.name = prefix;
      interest.mustBeFresh = true; 
      interest.lifetime = 1000;
      const dataObj = {
        nama: nama,
        hp: hp,
        penyakit: penyakit,
        jadwalkemo: jadwalkemo,
        terakhirkemo: terakhirkemo,
        jadwalkrio: jadwalkrio,
        terakhirkrio: terakhirkrio,
      };
      const jsonString = JSON.stringify(dataObj);
      const uint8Array = encoder.encode(jsonString);
      interest.appParameters = uint8Array;
      const t0 = Date.now();
      await interest.updateParamsDigest();
      try {
        // Retrieve Data and compute round-trip time.
        const data = await endpoint.consume(interest);
        const rtt = Date.now() - t0;
        const dataContent = data.content;
        //console.log(dataContent);
      } catch(err) {
        // Report Data retrieval error.
        //$log.textContent += `\n${AltUri.ofName(interest.name)} ${err}`;
      }

      // Delay 500ms before sending the next Interest.
      await new Promise((r) => setTimeout(r, 500));
    }
  } finally {
    // Re-enable the submit button.
    $button.disabled = false;
  }
}


async function main() {
    const face = await WsTransport.createFace({}, "wss://scbe.ndntel-u.my.id:9696");
    face.addRoute(new Name("/"));
  
  
    // Enable the form after connection was successful.
    document.querySelector("#app_button").disabled = false;
    document.querySelector("#app_form").addEventListener("submit", ping);
    document.querySelector("#app_datapasien").addEventListener("click", datapasien);
  }
  
  window.addEventListener("load", main);

