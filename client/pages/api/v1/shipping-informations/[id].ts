import axios from "axios";

const SHIPPING_INFO_URL = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/shipping-informations`

export default async function handler(req: any, res: any) {
    const userId = req.query.id;  
    const jwt = req.cookies.jwt;
    
    if(!jwt) {
        res.status(401).json({ statusCode: 401, message: 'Unauthorizated' })
    }
   
    const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwt}`
    }
    const urlFilter = `?filters[user_id][$eq]=${userId}`;

    if(req.method === 'GET') {
        try {
            const strapiRes = await axios.get(`${SHIPPING_INFO_URL}${urlFilter}`, { headers });
            res.status(200).json(strapiRes.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching shipping information' });
        }
    } else if(req.method === 'POST') {
        try {
            const existingDataRes = await axios.get(`${SHIPPING_INFO_URL}${urlFilter}`, { headers });
            const existingData = existingDataRes.data;
            const shippingListId = existingData.data[0]?.id;
            // const clientData = req.body?.data.shipping_info_list[0];
            
            // putem avea mai > de 1 adresa 
            const clientData = req.body?.data.shipping_info_list;

            let payload = null; 
            if (existingData && existingData.data?.length > 0) {
                // Data exists, perform PUT
                // if data exist, and there is a least 1 address added
                if(existingData.data[0].attributes.shipping_info_list?.length > 0) {
                    // if user adds 1 address
                    if(clientData.length === 1) {
                        const existingList = [...existingData.data[0].attributes.shipping_info_list]
                        
                        // if user adds a primary address
                        const isPrimary = clientData[0].primary;
                        if(isPrimary) {
                            const hasPrimary = (el: any) => el.primary;
                            const primaryAddressIndex = existingList.findIndex(hasPrimary);
    
                            // if a primary address exists, change it to false
                            if(primaryAddressIndex > -1) {
                                existingList[primaryAddressIndex].primary = false;
                                const newAddress = { ...clientData[0] };
                                existingList.unshift(newAddress);
                                payload = {
                                    data: {
                                        shipping_info_list: [...existingList],
                                        user_id: userId,
                                    }
                                }
                            } else {
                                existingList.push(clientData);
                                payload = {
                                    data: {
                                        shipping_info_list: [...existingList],
                                        user_id: userId,
                                    }
                                }
                            }
                        } else {
                            existingList.push(clientData[0])
                            payload = {
                                data: {
                                    shipping_info_list: [...existingList],
                                    user_id: userId,
                                }
                            }
                        }
                    } else {
                        // if user deletes 1 address, he will send the entire list
                        payload = {
                            data: {
                                shipping_info_list: [...clientData],
                                user_id: userId,
                            }
                        }
                    }
                } else {
                    // data exist, but no address added
                    payload = {
                        data: {
                            shipping_info_list: [{...clientData}],
                            user_id: userId
                        }
                    }
                }

                const putResponse = await axios.put(`${SHIPPING_INFO_URL}/${shippingListId}`, payload, { headers });
                res.status(200).json({ message: 'Data updated successfully', data: putResponse.data }); 
            } else {
                // No existing data, perform POST
                const newData = req.body;
                
                const postResponse = await axios.post(SHIPPING_INFO_URL, newData, { headers });
                res.status(201).json({ message: 'Data created successfully', data: postResponse.data });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing request' });
        }
    } else {
        res.setHeader('Allow', ["GET", "POST", "DELETE"]);
        res.status(405).end("Method not allowed")
    }
} 