import * as React from 'react';
import { Avatar } from '@fluentui/react-components';
import { Chat, ChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import { CompoundButton, Textarea, makeStyles } from '@fluentui/react-components';
import { SendRegular } from '@fluentui/react-icons';
import axios from 'axios';



enum MessageAuthor {
    Bot,
    User,
}

type MessageContent = {
    content: string;
    author: MessageAuthor;
};

async function fetchPokemonData(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      const data = response.data;
      const typeName = data.types[0].type.name;
      const weight = data.weight;
      const message = `The Pokémon is of type: ${typeName} and has a weight of ${weight} units.`;
      return message;
    } catch (error) {
      console.error('Error while fetching data:', error);
      throw error;
    }
  }

const useStyles = makeStyles({
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '30px',
      height: '320px',
    },
    chat: {
        paddingBottom: '30px',
        overflowY: 'auto',
    },
    chatTextarea: {
      display: 'flex',
      resize: 'none',
    },
    chatInputContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    sendIcon: {
      marginRight: '4px',
    },
  });

const ChatWindow = () => {
    // create a first welcome message from the Bot
    var welcomeMessage = {
        content: "Hello, how can I help you?",
        author: MessageAuthor.Bot,
    };

    const [messages, setMessages] = React.useState<MessageContent[]>([welcomeMessage,]); 
    const [answer, setAnswer] = React.useState<string>("");
    
    const handleAnswerChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        // if the new character is a new line, send the answer
        if (event.target.value.endsWith("\n")) {
            handleSend();
            setAnswer("");
            return;
        }
        setAnswer(event.target.value);
    };


    const handleSend = async () => {
        // if the answer is empty, do nothing
        if (answer.trim() === "") {
            return;
        }
        var message = {
            content: answer,
            author: MessageAuthor.User,
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        setAnswer("");
        // scroll to the bottom of the chat
        var chat = document.getElementById("messages");
        if (chat) {
            setTimeout(function() {
                chat.scrollTop = chat.scrollHeight;
            }, 100); // Adjust the delay time as needed
        }
        const url = "https://pokeapi.co/api/v2/pokemon/" + answer.trim().toLowerCase();
        const response = await fetchPokemonData(url);
        var botMessage = {
            content: response,
            author: MessageAuthor.Bot,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        if (chat) {
            setTimeout(function() {
                chat.scrollTop = chat.scrollHeight;
            }, 100); // Adjust the delay time as needed
        }


    };

    const styles = useStyles();

    
    return (
        <div className={styles.chatContainer}>
            <Chat id="messages" className={styles.chat}>
                {messages.map((message, index) => {
                    if (message.author === MessageAuthor.Bot) {
                        return (
                            <ChatMessage key={index} avatar={<Avatar name="Bot" badge={{ status: 'available' }} />}>{message.content}</ChatMessage>
                        );
                    } else {
                        return (
                            <ChatMyMessage key={index}>{message.content}</ChatMyMessage>
                        );
                    }
                })}
            </Chat>
            <div className={styles.chatInputContainer}>
                <Textarea className={styles.chatTextarea} id={`answer`} size="medium" value={answer} placeholder="Answer here" onChange={handleAnswerChange} />
                <CompoundButton icon={<SendRegular />} className={styles.sendIcon} onClick={handleSend} />
            </div>
            
        </div>
    );
};

export default ChatWindow;