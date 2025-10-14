document.getElementById("translate-btn").addEventListener("click", function() {
  var textToTranslate = document.getElementById("text-to-translate").value;
  var targetLanguage = document.getElementById("language-select").value;

  if (textToTranslate) {
    translateText(textToTranslate, targetLanguage);
  } else {
    alert("Будь ласка, введіть текст для перекладу.");
  }
});

function translateText(text, targetLang) {
  var apiKey = 'AIzaSyB752li53CcX70h6Tatmx4p9riJx1vOzmc'; // Вставте ваш API ключ
  var url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  // Відправка запиту на API Google Translate
  $.post(url, {
    q: text,
    target: targetLang
  }, function(response) {
    if (response.data && response.data.translations) {
      document.getElementById("translated-text").textContent = response.data.translations[0].translatedText;
    } else {
      document.getElementById("translated-text").textContent = 'Переклад не вдався.';
    }
  }).fail(function() {
    alert('Помилка під час перекладу.');
  });
}
;