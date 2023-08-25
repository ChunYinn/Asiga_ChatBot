import config
import openai

openai.api_key = config.API_KEY

messages = [{"role": "system", "content": "You are a helpful assistant."}]

while True:
    msg = input(">>> ")
    
    messages.append({"role": "user", "content": msg})
  
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    assistant_msg = response['choices'][0]['message']['content']
    messages.append({"role": "assistant", "content": assistant_msg})
    
    print("ChatGPT: ", assistant_msg.strip("\n").strip())
