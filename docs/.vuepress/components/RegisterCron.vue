<template>
  <v-container>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css"
    >
    <v-layout>
      <v-flex xs12>
        <v-textarea
          solo
          :value="jsonData"
          @input="updateJsonData"
          spellcheck="false"
          :background-color="isCorrectJSON?'none':'red'"
        ></v-textarea>
        <v-btn color="green" @click="registerCRON()" :disabled="!isCorrectJSON">Register</v-btn>
        <span v-html="responseMessage"></span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
.success {
  color: green;
}
.warning {
  color: orange;
}
</style>

<script>
import axios from 'axios';
import configJS from '../config.js';
function tryParseJSON(jsonString) {
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {
    return false;
  }
}
export default {
  data: function() {
    return {
      responseMessage: '',
      isCorrectJSON: true,
      jsonData: JSON.stringify(
        JSON.parse(
          '{"filename": "cron-*.rulesrc", "projectURL": "https://github.com/DX-DeveloperExperience/hygie", "expression": "0 0 6-20/1 * * *"}',
        ),
        undefined,
        4,
      ),
    };
  },
  methods: {
    updateJsonData(uglyJsonData) {
      const obj = tryParseJSON(uglyJsonData);
      if (obj !== false) {
        this.isCorrectJSON = true;
        this.jsonData = JSON.stringify(obj, undefined, 4);
      } else {
        this.isCorrectJSON = false;
      }
    },
    registerCRON() {
      this.responseMessage = '';
      const serverURL = configJS.gitwebhooksURL + '/cron';
      axios
        .post(serverURL, JSON.parse(this.jsonData))
        .then(response => {
          this.responseMessage =
            '<span class="success">' + response.data + '</span>';
        })
        .catch(err => {
          if (typeof err.response !== 'undefined') {
            this.responseMessage =
              '<span class="warning">' + err.response.data + '</span>';
          } else {
            this.responseMessage =
              '<span class="warning">No response from server</span>';
          }
        });
    },
  },
};
</script>

