export const DocumentParserService = {
  parse: async (file) => {
    return new Promise((resolve, reject) => {
      // Mock parsing logic based on file type
      // In a real frontend-only env, we can read text files, but PDF/Word requires heavy libs not allowed here
      
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        
        // Simple heuristic parser
        const structure = {
          introduction: '',
          biblicalContext: '',
          development: '',
          application: '',
          conclusion: ''
        };

        // If it's a text file, try to find sections by keywords
        if (typeof text === 'string') {
          const lowerText = text.toLowerCase();
          
          if (lowerText.includes('introdução')) {
            structure.introduction = extractSection(text, 'Introdução', ['Contexto', 'Desenvolvimento']);
          } else {
             // Fallback: take first paragraph
             structure.introduction = text.split('\n\n')[0] || '';
          }

          if (lowerText.includes('contexto')) {
            structure.biblicalContext = extractSection(text, 'Contexto', ['Desenvolvimento', 'Aplicação']);
          }

          if (lowerText.includes('desenvolvimento') || lowerText.includes('pontos')) {
            structure.development = extractSection(text, 'Desenvolvimento', ['Aplicação', 'Conclusão']);
          }

          if (lowerText.includes('aplicação')) {
            structure.application = extractSection(text, 'Aplicação', ['Conclusão']);
          }

          if (lowerText.includes('conclusão')) {
            structure.conclusion = extractSection(text, 'Conclusão', []);
          }
        }

        resolve({
          title: file.name.split('.')[0],
          structure
        });
      };

      reader.onerror = () => reject('Erro ao ler arquivo');

      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For binary files (mocking extraction)
        setTimeout(() => {
          resolve({
            title: file.name.split('.')[0],
            baseText: 'Texto extraído do arquivo...',
            structure: {
              introduction: 'Introdução extraída automaticamente do documento enviado.',
              biblicalContext: 'Contexto bíblico identificado no arquivo.',
              development: 'Pontos principais:\n1. Primeiro ponto identificado.\n2. Segundo ponto identificado.',
              application: 'Aplicações práticas sugeridas pelo analisador.',
              conclusion: 'Conclusão gerada a partir do fechamento do texto.'
            }
          });
        }, 1500);
      }
    });
  }
};

// Helper function to extract text between sections
function extractSection(text, startKeyword, endKeywords) {
  const lines = text.split('\n');
  let capturing = false;
  let content = [];
  
  for (let line of lines) {
    if (line.toLowerCase().includes(startKeyword.toLowerCase())) {
      capturing = true;
      continue; 
    }
    
    if (capturing) {
      if (endKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
        break;
      }
      content.push(line);
    }
  }
  
  return content.join('\n').trim();
}
