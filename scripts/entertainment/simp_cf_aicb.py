import requests
import json

url = "https://worker-icy-rice-1671.euk6.workers.dev/"

messages = []

def send_message(role, content):
	global messages

	messages.append({"role": role, "content": content})

	data = {
		"messages": messages
	}
	# print("sent data: ", data)
	headers = {'Content-Type': 'application/json'}

	response = requests.post(url, data=json.dumps(data), headers=headers)
	return response.json()

while True:
	user_input = input("User: ")
	response = send_message("user", user_input)
	resp_msg = response['response']
	print("Bot:", resp_msg)
	# 一切正常，问题是不知道为什么回复异常，感觉也不是llama的识别是倒过来的
	messages.append({"role": "assistant", "content": resp_msg})

'''
import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    const tasks = [];
    const ai = new Ai(env.AI);

    const body = await request.text();
    const json = JSON.parse(body);
    // console.log(json);

    const resp = await ai.run('@cf/meta/llama-2-7b-chat-int8', json)

    return Response.json(resp);
  }
};
'''
