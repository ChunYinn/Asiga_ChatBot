import config
import openai

openai.api_key = config.API_KEY

messages = [{"role": "system", "content": "You are a helpful assistant."}]

def chat_with_gpt3(user_input):
    messages.append({"role": "user", "content": user_input})
  
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    assistant_msg = response['choices'][0]['message']['content']
    messages.append({"role": "assistant", "content": assistant_msg})
    
    return assistant_msg.strip("\n").strip()
