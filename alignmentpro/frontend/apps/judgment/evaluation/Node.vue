<template>
  <v-card height="100%" class="noderesource">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs9 sm10>
          <b>Source Standard:</b> {{ nodeData.document.title }}
          <p class="curriculum-metadata">
            {{ nodeData.document.country }}
            <span v-if="nodeData.document.official">
              &nbsp;•&nbsp;
              <v-tooltip bottom max-width="200px">
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="official">
                    <v-icon small color="primary">check_circle_outline</v-icon>
                    Official national curriculum
                  </span>
                </template>
                <span
                  >These standards have been verified as the officially produced
                  curriculum of their respective national ministry</span
                >
              </v-tooltip>
            </span>
          </p>
        </v-flex>
        <v-spacer />
        <v-flex style="text-align: right;">
          <Flag :country="nodeData.document.country" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-divider />
    <v-breadcrumbs v-if="ancestors && ancestors.length" :items="ancestors">
      <template v-slot:item="props">
        <span class="chip">{{ props.item.title }}</span>
      </template>
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container fluid>
      <h1>{{ nodeData.title }}</h1>
      <p v-if="nodeData.nodes" style="margin-top: 15px;">
        {{ nodeData.notes }}
      </p>
    </v-container>
    <template v-if="nodeData.children && nodeData.children.length">
      <v-divider />
      <v-container fluid>
        <ul>
          <li
            v-for="nodeDatum in nodeData.children"
            :key="'descendant' + nodeDatum.id"
          >
            {{ nodeDatum.title }}
          </li>
        </ul>
      </v-container>
    </template>
  </v-card>
</template>

<script>
// This component provides a basic display for a node
import Flag from "./Flag";
var lookup = require("country-code-lookup");

export default {
  name: "Node",
  props: {
    nodeData: {
      type: Object,
      required: true
    }
  },
  components: {
    Flag
  },
  computed: {
    flag() {
      let country = this.nodeData.document.country;

      return (lookup.byCountry(country) || lookup.byIso(country)).iso3;
    },
    ancestors() {
      return this.nodeData.ancestors.slice(1, this.nodeData.length);
    }
  }
};
</script>

<style>
.chip {
  background-color: rgb(120, 170, 232, 0.11);
  padding: 3px 10px;
  border-radius: 10px;
  margin: 5px;
}
.document {
  margin: 0;
  padding: 10px;
  background-color: rgb(120, 170, 232, 0.11);
}

.noderesource p {
  font-size: 12pt;
  color: gray;
}

.noderesource .curriculum-metadata {
  font-size: 9pt;
  font-weight: bold;
}

.noderesource .official {
  color: #18baff;
  cursor: pointer;
}

h1 {
  font-size: 28pt;
}
</style>
