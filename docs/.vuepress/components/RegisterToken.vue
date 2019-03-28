<template>
  <v-container>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css"
    >

    <v-layout>
      <v-flex xs12>
        <v-form v-model="valid" ref="form">
          <v-flex class="padding">
            <label>
              <v-text-field
                type="text"
                placeholder="https://github.com/DX-DeveloperExperience/git-webhooks"
                label="Git repository URL"
                v-model="gitRepo"
                :rules="urlRules"
                required
              />
            </label>
          </v-flex>
          <v-flex class="padding">
            <v-text-field
              type="text"
              placeholder="https://api.github.com"
              label="Git API URL"
              v-model="gitApi"
              :rules="urlRules"
              required
            />
          </v-flex>
          <v-flex class="padding">
            <v-text-field
              type="text"
              placeholder="your personnal access token"
              label="Git Token"
              v-model="gitToken"
              :rules="tokenRules"
              required
            />
          </v-flex>
          <v-flex>
            <v-btn @click="registerToken">Register Token</v-btn>
            <span v-html="responseMessage"></span>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
.padding {
  padding-top: 5px;
  padding-bottom: 5px;
}
.success {
  color: green;
}
.warning {
  color: orange;
}
.error--text {
  color: orange !important;
}
</style>

<script>
import axios from 'axios';
export default {
  data: function() {
    return {
      valid: false,
      gitRepo: '',
      gitToken: '',
      gitApi: '',
      responseMessage: '',
      urlRules: [
        v => !!v || 'field required',
        v =>
          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
            v,
          ) || 'field must be a valid URL',
      ],
      tokenRules: [v => !!v || 'field required'],
    };
  },
  methods: {
    registerToken() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const serverURL = 'http://localhost:3000/config-env';
      axios
        .post(serverURL, {
          gitToken: this.gitToken,
          gitApi: this.gitApi,
          gitRepo: this.gitRepo,
        })
        .catch(err => {
          this.responseMessage =
            '<span class="warning">Server to no answer</span>';
        })
        .then(response => {
          if (response.data.alreadyExist) {
            this.responseMessage =
              '<span class="warning">A config file with your repository already exist. It has been overwrite with the present token and API URL.</span>';
          } else {
            this.responseMessage =
              '<span class="success">Token stored successfully!</span>';
          }
        });
    },
  },
};
</script>
