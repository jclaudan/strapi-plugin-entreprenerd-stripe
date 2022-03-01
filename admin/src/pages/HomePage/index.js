/*
*
* HomePage
*
*/

import React, { useState, useEffect, memo } from 'react';
import { Box, Stack } from "@strapi/design-system";
import { Divider } from "@strapi/design-system/Divider";
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {
  request
} from '@strapi/helper-plugin'

import { InputText, Button, Padded } from '@buffetjs/core'

const HomePage = () => {

  const [pk, setPk] = useState('')
  const [frontUrl, setFrontUrl] = useState('')

  useEffect(() => {
    const loadPkAndFrontUrl = async () => {
      try {
        const response = await request(`/${pluginId}/settings`, {
          method: 'GET'
        })
        console.log({response})
        const {pk, frontUrl} = response
        setPk(pk)
        setFrontUrl(frontUrl)
      } catch (error) {
        console.log({error})
      }
    }
    loadPkAndFrontUrl()
  }, [])

  const updatedPk = async (e) => {
    try {
      e.preventDefault()
      // strapi.lockApp()
      const response = await request(`/${pluginId}/settings`, {
        method: 'POST',
        body: {pk, frontUrl}
      })
      console.log({response})
      // strapi.notification.success('Success')
    } catch(error){
      console.log({error})
      strapi.notification.error(error.toString())
    }
    // strapi.unlockApp()
  }

  return (
    <div>
      <Box padding={4} >
        <h1>Stripe</h1>
        <p>Save your private key here</p>
        <Divider />
      </Box>
      <Stack vertical size={2}>
        <div>
          <form onSubmit={updatedPk}>
            <InputText 
              value={pk}
              onChange={(e) => setPk(e.target.value)}
              name="input"
              type="password"
              placeholder="Stripe Private Key"
            />
            <InputText 
              value={frontUrl}
              onChange={(e) => setFrontUrl(e.target.value)}
              name="clientUrl"
              type="text"
              placeholder="front url"
            />
            <Button color="primary" label="Submit" type="submit" />
          </form>
        </div>
      </Stack>
    </div>
  );
};

export default memo(HomePage);
