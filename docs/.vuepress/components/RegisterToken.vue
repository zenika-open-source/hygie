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
                @change="checkGitURL"
              />
            </label>
          </v-flex>
          <v-flex class="padding" :class="hiddenApiURL">
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
            <v-btn @click="registerToken" color="green">Register Token</v-btn>
            <span v-html="responseMessage"></span>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
.hidden {
  display: none;
}
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
import configJS from '../config.js';

export default {
  data: function() {
    return {
      hiddenApiURL: 'hidden',
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
    checkGitURL(url) {
      const regexpGithub = new RegExp('^https://github.com/.*');
      const regexpGitlab = new RegExp('^https://gitlab.com/.*');

      if (regexpGithub.test(url)) {
        this.gitApi = 'https://api.github.com';
        this.hiddenApiURL = 'hidden';
      } else if (regexpGitlab.test(url)) {
        this.gitApi = 'https://gitlab.com/api/v4';
        this.hiddenApiURL = 'hidden';
      } else {
        this.hiddenApiURL = '';
      }
    },
    registerToken() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const serverURL = configJS.gitwebhooksURL + '/config-env';
      axios
        .post(serverURL, {
          gitToken: this.gitToken,
          gitApi: this.gitApi,
          gitRepo: this.gitRepo,
        })
        .then(response => {
          if (response.data.alreadyExist) {
            this.responseMessage =
              '<span class="warning">A config file with your repository already exist. It has been overwrite with the present token and API URL.</span>';
          } else {
            this.responseMessage =
              '<span class="success">Token stored successfully!</span>';
          }
        })
        .catch(err => {
          this.responseMessage =
            '<span class="warning">No response from server</span>';
        });
    },
  },
};
</script>
