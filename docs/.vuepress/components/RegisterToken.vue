<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-flex>
          <v-text-field type="text" placeholder="github/gitlab repository" v-model="gitRepo"/>
        </v-flex>
        <v-flex>
          <v-text-field type="text" placeholder="your api" v-model="gitApi"/>
        </v-flex>
        <v-flex>
          <v-text-field type="text" placeholder="your token" v-model="gitToken"/>
        </v-flex>
        <v-flex>
          <v-btn @click="registerToken()">Register Token</v-btn>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data: function() {
    return {
      gitRepo: '',
      gitToken: '',
      gitApi: '',
    };
  },
  methods: {
    registerToken() {
      console.log('gitToken:' + this.gitToken);
      console.log('gitApi:' + this.gitApi);

      const serverURL = 'http://localhost:3000/config-env';
      axios
        .post(serverURL, {
          gitToken: this.gitToken,
          gitApi: this.gitApi,
          gitRepo: this.gitRepo,
        })
        .then(response => console.log(response));
    },
  },
};
</script>
