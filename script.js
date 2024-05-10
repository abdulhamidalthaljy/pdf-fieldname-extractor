async function loadPDF() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const pdfBytes = new Uint8Array(event.target.result);
    await getFields(pdfBytes);
  };
  reader.onerror = function (event) {
    console.error("Error reading file:", event.target.error);
  };
  reader.readAsArrayBuffer(file);
}

async function getFields(pdfBytes) {
  try {
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    let outputString = "";
    fields.forEach((field) => {
      const type = field.constructor.name;
      const name = field.getName();
      outputString += `${type}: ${name}\n`;
    });
    document.getElementById("output").textContent = outputString;
  } catch (error) {
    console.error("Error:", error);
  }
}

function copyOutput() {
  const outputElement = document.getElementById("output");
  const range = document.createRange();
  range.selectNode(outputElement);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}
