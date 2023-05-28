import { EnvironmentalVariables } from "./EnvironmentalVariables";
import axios from "axios"

const apiKey = EnvironmentalVariables.MAILcHIMP_API_KEY;
const serverPrefix = EnvironmentalVariables.SERVER_PREFIX;
const listId = EnvironmentalVariables.LIST_ID;

export async function addUserToList(email: string, content: string,title: string) {
    try {
        const response = await axios.post(
            `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`,
            {
              email_address: email,
              status: 'subscribed'
              // Add any additional fields or merge tags as needed
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
              }
            }
          );
      
          console.log('User added to the mailing list:', response.data.id);
      
          // Proceed to send the email campaign to the user
          const userId = response.data.id;

          console.log(userId)
  
  
      // Call the function to send the email campaign to the user
    await  sendEmailCampaign(userId, content,title);
  
    } catch (error) {
      console.error('Error adding user to the mailing list:', error);
    }
  }
  
  async function sendEmailCampaign(subscriberId : any, content: string,title: string,) {
    try {
        console.log("this is ",subscriberId)
        const response = await axios.post(
            `https://${serverPrefix}.api.mailchimp.com/3.0/campaigns`,
            {
                type: 'regular',
                recipients: {
                  list_id: listId,
                  segment_opts: {
                     saved_segment_id: parseInt(subscriberId, 10)
                  }
              },
              settings: {
                subject_line: 'Welcome to our application!',
                reply_to: 'your-email@example.com',
                from_name: 'Your Application Name',
              },
              content: {
                html: '<p>Hello, thank you for registering!</p>'
              }
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
              }
            }
          );
      
          console.log('Email campaign sent successfully:', response.data);
  
    } catch (error:any) {
      console.error('Error sending email campaign:', error.response.data);
    }
  }
  
  // Usage
//   addUserToList('user@example.com');

// Usage
// sendRegistrationEmail('user@example.com',"hello");