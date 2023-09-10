from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
import os
import config
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

def load_all_documents_in_directory(directory_path):
  documents = []
  success_count,failed_count = 0,0
  # Get a list of all files in the directory
  all_files = [f for f in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, f)) and f.endswith('.txt')]


  # Load each file and concatenate the content to 'documents'
  for file in all_files:
      file_path = os.path.join(directory_path, file)
      #print(file_path)
      try:
          loader = TextLoader(file_path).load()
          documents += loader
          success_count += 1
      except Exception as e:
          failed_count += 1
          print(f"Error loading {file_path}:")
  print(f"Loaded {success_count} files, failed to load {failed_count} files.")
  return documents

def trained_gpt(question):
  os.environ['OPENAI_API_KEY'] = config.API_KEY
 
  directory_path = "src/real_data/quick-answers"
  documents = load_all_documents_in_directory(directory_path)

  text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
  texts = text_splitter.split_documents(documents)

  embeddings = OpenAIEmbeddings()
  docsearch = Chroma.from_documents(texts, embeddings)
  
  custom_template = """You are the customer support assistant. If you don't know the answer, just say that you don't know respectfully, don't try to make up an answer, and if you can't understand the question, just say you don't understand the question, tell the customer to ask again. Please provide the answer in English and the answer should be detailed:
  {context}
  
  Question: {question}
  Answer in English Respectfully:"""
  
  PROMPT = PromptTemplate(
      template=custom_template, input_variables=["context", "question"]
  )
  
  embeddings = OpenAIEmbeddings()
  chain_type_kwargs = {"prompt": PROMPT}
  qa = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=docsearch.as_retriever(search_type="mmr", search_kwargs={'k': 2}), chain_type_kwargs=chain_type_kwargs)

  return qa.run(question)


# from langchain.indexes import VectorstoreIndexCreator
# index = VectorstoreIndexCreator().from_loaders([loader, loader2])

# query = "What is the composer command line option to clear composer settings?"
# print(trained_gpt(query))

#------------------------------------------------------------
# from langchain.embeddings.openai import OpenAIEmbeddings
# from langchain.vectorstores import Chroma
# from langchain.text_splitter import CharacterTextSplitter
# from langchain.llms import OpenAI
# from langchain.chains import ConversationalRetrievalChain
# from langchain.memory import ConversationBufferMemory
# from langchain.chat_models import ChatOpenAI
# from langchain.prompts.prompt import PromptTemplate

# # def trained_gpt_with_history(question):
# chat_history = []
# os.environ['OPENAI_API_KEY'] = config.API_KEY

# directory_path = "src/real_data/quick-answers"
# documents = load_all_documents_in_directory(directory_path)

# text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
# documents = text_splitter.split_documents(documents)

# embeddings = OpenAIEmbeddings()
# vectorstore = Chroma.from_documents(documents, embeddings)

# def get_chat_history(inputs) -> str:
#     res = []
#     for human, ai in inputs:
#         res.append(f"Human:{human}\nAI:{ai}")
#     return "\n".join(res)
  
# qa = ConversationalRetrievalChain.from_llm(OpenAI(temperature=0), vectorstore.as_retriever(), get_chat_history=get_chat_history)

# chat_history = []
# result = qa({"question": query, "chat_history": chat_history})
# print(result['answer'])

# query = "what is the command you provide mean for?"
# result = qa({"question": query, "chat_history": chat_history})
# print(result['answer'])

# query = "--profile-reset menas elp you get the debug log, error log, and printer.ini files from your printer?"
# result = qa({"question": query, "chat_history": chat_history})
# print(result['answer'])
