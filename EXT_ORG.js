let alltext = [];
let textocompleto;


pdfjsLib.GlobalWorkerOptions.workerSrc ="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// Obtém referências para vários elementos
let pdfinput = document.querySelector(".selectpdf"); // Referência ao campo de input do arquivo PDF
let upload = document.querySelector(".upload"); // Referência ao botão de upload
let afterupload = document.querySelector(".afterupload"); // Referência à seção de resultado
let select = document.querySelector("select"); // Referência ao menu suspenso de seleção de página
let download = document.querySelector(".download"); // Referência ao link de download
let pdftext = document.querySelector(".pdftext"); // Referência à área de texto para exibir o texto extraído

// Evento de escuta para o clique no botão de upload
upload.addEventListener("click", () => {
  let file = pdfinput.files[0]; // Obtém o arquivo PDF selecionado
  if (file != undefined && file.type == "application/pdf") {
    let fr = new FileReader(); // Cria um novo objeto FileReader
    fr.readAsDataURL(file); // Lê o arquivo como URL de dados
    
    fr.onload = () => {
    let res = fr.result; // Obtém o resultado da leitura do arquivo
    extractText(res, textocompleto)
    };

  } else {
    alert("Selecione um arquivo PDF válido");
  }
});



async function extractText(url, textocompleto) {
  try {
    let pdf;

    pdf = await pdfjsLib.getDocument(url).promise;
    
    let pages = pdf.numPages; // Obtém o número total de páginas no PDF

    for (let i = 1; i <= pages; i++) {
      let page = await pdf.getPage(i); // Obtém o objeto de página para cada página
      let txt = await page.getTextContent(); // Obtém o conteúdo de texto da página
      let text = txt.items.map((s) => s.str).join(""); // Concatena os itens de texto em uma única string
      alltext.push(text); // Adiciona o texto extraído ao array

      textocompleto = textocompleto + text;
    }

    alltext.map((e, i) => {
      select.innerHTML += `<option value="${i + 1}">${i + 1}</option>`; // Adiciona opções para cada página no menu suspenso de seleção de página
    });


      //extrairInformacaoEntreMarcadores("Resumo", "Experiência", "Formação acadêmica");
      function extrairInformacaoEntreMarcadores(marcadorInicial, marcadorFinal, reseva1,reseva2) {
        var inicioIndex = textocompleto.indexOf(marcadorInicial);
        var fimIndex = textocompleto.indexOf(marcadorFinal);


        // Certifique-se de que o marcador inicial existe no textocompleto
        if ((inicioIndex !== -1) && (fimIndex !== -1)) {
          var fimIndex = textocompleto.indexOf(marcadorFinal, inicioIndex + marcadorInicial.length);
          var informacaoEntreMarcadores = textocompleto.substring(inicioIndex + marcadorInicial.length, fimIndex).trim();
          console.log(`${marcadorInicial}:`, informacaoEntreMarcadores);
          return informacaoEntreMarcadores;

        }else if ((inicioIndex !== -1) && (fimIndex == -1)){
          extrairInformacaoEntreMarcadores(marcadorInicial,reseva1);
        }else if (inicioIndex == -1){
          console.log(`Não foi possível encontrar '${marcadorInicial}' no textocompleto.`);
        }
        
      }
    
    let CONTATO = extrairInformacaoEntreMarcadores("Contato", "Principais competências","Languages");
    let COMPETENCIAS = extrairInformacaoEntreMarcadores("Principais competências", "Languages","Certifications");
    let LANGUAGES = extrairInformacaoEntreMarcadores("Languages", "Certifications", "Resumo");
    let CERTIFICATIONS = extrairInformacaoEntreMarcadores("Certifications", "Resumo", "Experiência");
    let RESUMO = extrairInformacaoEntreMarcadores("Resumo", "Experiência", "Formação acadêmica");
    let EXPERIENCIAS = extrairInformacaoEntreMarcadores("Experiência", "Formação acadêmica");
    
    let FORMACAO = textocompleto.substring(textocompleto.indexOf("Formação acadêmica") + "Formação acadêmica".length);
    console.log('formação:', FORMACAO)

    let timexp = textocompleto.substring(textocompleto.indexOf("Experiência") + "Experiência".length, textocompleto.indexOf("Formação acadêmica"));

    function extrairAnosMeses(texto_experiencia) {
      if (texto_experiencia == "Não foi possível encontrar Experiência no textocompleto."){
        timexp = 0;

      }else{
          
          let tempo_experiencia = 0;
          var regex = /(\d*)\s*ano[s]?|(\d*)\s*m[eê]s[es]?|(\d+)\s*ano[s]?\s*(\d+)\s*m[eê]s[es]?/ig;

          var matches;
          var resultados = [];
      
          while ((matches = regex.exec(texto_experiencia)) !== null) {
              var anos = parseInt(matches[1]) || 0;
              var meses = parseInt(matches[2]) || 0;
              var totalMeses = anos * 12 + meses;
      
              resultados.push({ anos, meses, totalMeses });
              tempo_experiencia = tempo_experiencia + totalMeses;
          }
          timexp = tempo_experiencia
      
          console.log("Tempo total de experiência:", tempo_experiencia, "meses");
        }
    }
    
    // Exemplo de chamada da função
    if (textocompleto.indexOf("Experiência") !== -1){
      extrairAnosMeses(timexp);
    }else{
      console.log("Sem experiencia")
    }
    
    

    function escolaridade(FORMACAO){
      var ensinoMedio = FORMACAO.indexOf("Ensino Médio");
      var mestrado = FORMACAO.indexOf("Mestrado");
      var bacharelado = FORMACAO.indexOf("Bacharelado");
      var tecnologo = FORMACAO.indexOf("Técnologo");
      var licenciatura = FORMACAO.indexOf("Licenciatura");
      var posGraduacao = FORMACAO.indexOf("Pós-graduação");
      var doutorado = FORMACAO.indexOf("Doutorado");

    
      //DOUTORADO
      if (doutorado !== -1){
        doutorado = 1;
        ensinoMedio = 1;
        console.log(`doutorado`, doutorado);
      }else{
        doutorado = 0;
        console.log(`doutorado`, doutorado);
      }

      //MESTRADO
      if (mestrado !== -1){
        mestrado = 1;
        ensinoMedio = 1;
        console.log(`mestrado`, mestrado);
      }else{
        mestrado = 0;
        console.log(`mestrado`, mestrado);
      }

      //BACHARELADO
      if (bacharelado !== -1){
        bacharelado = 1;
        ensinoMedio = 1;
        console.log(`bacharelado`, bacharelado);
      }else{
        bacharelado = 0;
        console.log(`bacharelado`, bacharelado);
      }

      //TECNOLOGO
      if (tecnologo !== -1){
        tecnologo = 1;
        ensinoMedio = 1;
        console.log(`tecnologo`, tecnologo);
      }else{
        tecnologo = 0;
        console.log(`tecnologo`, tecnologo);
      }

      //LICENCIATURA
      if (licenciatura !== -1){
        licenciatura = 1
        ensinoMedio = 1;;
        console.log(`licenciatura`, licenciatura);
      }else{
        licenciatura = 0;
        console.log(`licenciatura`, licenciatura);
      }

      //PÓS GRADUAÇÃO
      if (posGraduacao !== -1){
        posGraduacao = 1;
        ensinoMedio = 1;
        console.log(`posGraduacao`, posGraduacao);
      }else{
        posGraduacao = 0;
        console.log(`posGraduacao`, posGraduacao);
      }

      //ENSINO MÉDIO
      if (ensinoMedio != 1){
        if (ensinoMedio !== -1){
          ensinoMedio =1;
        } else{
          ensinoMedio = 0;
        }
      }
      
    }
    escolaridade(FORMACAO);
     
    
    afterProcess(); // Exibe a seção de resultado
  } catch (err) {
    alert(err.message);
  }
}



function afterProcess() {
  pdftext= textocompleto; // Exibe o texto extraído para a página selecionada
  download.href =
    "data:text/plain;charset=utf-8," +
    encodeURIComponent(textocompleto);
  afterupload.style.display = "flex"; 
  document.querySelector(".another").style.display = "unset";
}