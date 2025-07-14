#!/usr/bin/env python3
"""
Script para importar test cases JSON para TestRail via API
Requer: pip install testrail-api requests
"""

import json
import requests
from requests.auth import HTTPBasicAuth

class TestRailImporter:
    def __init__(self, base_url, username, password):
        """
        Inicializa o importador TestRail
        
        Args:
            base_url: URL da instância TestRail (ex: https://company.testrail.io)
            username: Email do usuário TestRail
            password: Senha ou API Key do TestRail
        """
        self.base_url = base_url.rstrip('/')
        self.auth = HTTPBasicAuth(username, password)
        self.headers = {'Content-Type': 'application/json'}
    
    def create_test_case(self, section_id, test_case_data):
        """
        Cria um test case no TestRail
        
        Args:
            section_id: ID da seção onde criar o test case
            test_case_data: Dados do test case
            
        Returns:
            Response da API
        """
        url = f"{self.base_url}/index.php?/api/v2/add_case/{section_id}"
        
        # Converte os steps para o formato TestRail
        steps_data = []
        for i, step in enumerate(test_case_data.get('steps', []), 1):
            steps_data.append({
                'content': step.get('action', ''),
                'expected': step.get('expected', '')
            })
        
        payload = {
            'title': test_case_data.get('title', ''),
            'type_id': self.get_type_id(test_case_data.get('type', 'Functional')),
            'priority_id': self.get_priority_id(test_case_data.get('priority', 'Medium')),
            'custom_preconds': test_case_data.get('preconditions', []),
            'custom_steps': steps_data,
            'refs': test_case_data.get('id', '')
        }
        
        response = requests.post(url, json=payload, auth=self.auth, headers=self.headers)
        return response
    
    def get_type_id(self, type_name):
        """Mapeia tipo para ID do TestRail"""
        type_mapping = {
            'Functional': 1,
            'UI': 2, 
            'Validation': 3,
            'End-to-End': 4,
            'Performance': 5
        }
        return type_mapping.get(type_name, 1)
    
    def get_priority_id(self, priority_name):
        """Mapeia prioridade para ID do TestRail"""
        priority_mapping = {
            'Low': 1,
            'Medium': 2,
            'High': 3,
            'Critical': 4
        }
        return priority_mapping.get(priority_name, 2)
    
    def import_from_json(self, json_file_path, section_id):
        """
        Importa test cases de um arquivo JSON
        
        Args:
            json_file_path: Caminho para o arquivo JSON
            section_id: ID da seção no TestRail
            
        Returns:
            Lista de resultados da importação
        """
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        results = []
        test_cases = data.get('test_cases', [])
        
        print(f"Importando {len(test_cases)} test cases de {json_file_path}...")
        
        for test_case in test_cases:
            try:
                response = self.create_test_case(section_id, test_case)
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Importado: {test_case['title']} (ID: {result['id']})")
                    results.append({'success': True, 'test_case': test_case, 'response': result})
                else:
                    print(f"❌ Erro ao importar: {test_case['title']} - {response.text}")
                    results.append({'success': False, 'test_case': test_case, 'error': response.text})
            except Exception as e:
                print(f"❌ Exceção ao importar: {test_case['title']} - {str(e)}")
                results.append({'success': False, 'test_case': test_case, 'error': str(e)})
        
        return results

def main():
    """Função principal para execução do script"""
    
    # Configurações do TestRail (CONFIGURE AQUI)
    TESTRAIL_URL = "https://sua-empresa.testrail.io"  # Substitua pela sua URL
    USERNAME = "seu-email@empresa.com"                # Substitua pelo seu email
    PASSWORD = "sua-api-key-ou-senha"                 # Substitua pela sua API key
    
    # IDs das seções no TestRail (CONFIGURE AQUI)
    SERVICE_REQUEST_SECTION_ID = 1  # ID da seção Service Request
    ATESTADO_SECTION_ID = 2        # ID da seção Atestado  
    REFERRAL_SECTION_ID = 3        # ID da seção Referral
    
    # Inicializa o importador
    importer = TestRailImporter(TESTRAIL_URL, USERNAME, PASSWORD)
    
    # Lista de arquivos para importar
    import_files = [
        ('test-cases-service-request.json', SERVICE_REQUEST_SECTION_ID, 'Service Request'),
        ('test-cases-atestado.json', ATESTADO_SECTION_ID, 'Atestado'),
        ('test-cases-referral.json', REFERRAL_SECTION_ID, 'Referral')
    ]
    
    # Executa a importação
    all_results = []
    for json_file, section_id, feature_name in import_files:
        print(f"\n🚀 Iniciando importação de {feature_name}...")
        results = importer.import_from_json(json_file, section_id)
        all_results.extend(results)
        
        success_count = sum(1 for r in results if r['success'])
        total_count = len(results)
        print(f"📊 {feature_name}: {success_count}/{total_count} test cases importados com sucesso")
    
    # Relatório final
    total_success = sum(1 for r in all_results if r['success'])
    total_cases = len(all_results)
    print(f"\n🎯 RESUMO FINAL: {total_success}/{total_cases} test cases importados com sucesso")

if __name__ == "__main__":
    main()