import openai
import src.config

# Returns None if an error occured in processing the input
def input_output():
    user_input = get_input()
    chatbot_output = parse_input(user_input)
    if chatbot_output == None:
        return None
    output_ret = give_output(chatbot_output)
    if output_ret == 0:
        return None
    return chatbot_output

# Gets the user's input
# Takes no arguments
# Returns: A string of the input from the user
def get_input():
    return ""

# Parses the given string, and recieves the determined response from the LLM
# Takes one positional argument:
#   user_input: input from the user to be processes
# Returns: A string of the output that is to be sent to the user
#          None if there was an error parsing the input
def parse_input(user_input):
    return None

# Displays the given string to the user
# Takes one positional argument:
#   output: output that is required to be sent to the user
# Returns: 1 on successful completion of output operations
#          0 on failure to complete output operations
def give_output(chatbot_output):
    return 0


# TODO # Fit the code from below into functions and/or classes
if __name__=='__main__':
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

