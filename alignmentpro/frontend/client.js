import _ from "lodash";
import axios from "axios";
import session from "./session";
import get_cookie from "get-cookie";

export const baseUrl = "";

export function login(username, password) {
  return axios
    .post(`${baseUrl}/api-token-auth/`, { username, password }, {headers: {'X-CSRFToken': get_cookie('csrftoken')}})
    .then(response => {
      session.username = username;
      session.token = response.data.token;
    });
}

class Resource {
  constructor(resourceName) {
    this.resourceName = resourceName;
  }

  get baseUrl() {
    return `${baseUrl}/api/${this.resourceName}/`;
  }

  get config() {
    return {
      headers: {
        Authorization: `Token ${session.token}`
      }
    };
  }

  modelUrl(id) {
    return `${this.baseUrl}${id}`;
  }

  getModel(id) {
    return axios.get(this.modelUrl(id), this.config).then(response => {
      return response.data;
    });
  }
}

class DocumentResource extends Resource {
  getDocuments() {
    return axios.get(`${this.baseUrl}`, this.config).then(response => {
      return response.data.results;
    });
  }
}
export const documentResource = new DocumentResource("document");

class LeaderboardResource extends Resource {
  get baseUrl() {
    return `${baseUrl}/api/${this.resourceName}`;
  }

  getLeaderboard() {
    return axios.get(`${this.baseUrl}`, this.config).then(response => {
      return response.data;
    });
  }
}
export const leaderboardResource = new LeaderboardResource("leaderboard");

class NodeResource extends Resource {
  getNodeInCurriculum(curriculum) {
    return axios
      .get(`${this.baseUrl}?document=${curriculum}`, this.config)
      .then(response => {
        let results = response.data.results;
        let depthMax = _.maxBy(response.data.results, "depth").depth;
        results = _.filter(results, { depth: depthMax });
        return results[_.random(0, results.length - 1)];
      });
  }
  getComparisonNodes(curriculum, scheduler = "random") {
    return axios
      .get(`${this.baseUrl}?scheduler=${scheduler}`, this.config)
      .then(response => {
        return response.data.results;
      });
  }
  getNodeToCompareTo(baseNode, scheduler = "random") {
    return axios
      .get(
        `${this.baseUrl}?left_root_id=${baseNode}&scheduler=${scheduler}`,
        this.config
      )
      .then(response => {
        return _.reject(response.data.results, { id: baseNode })[0];
      });
  }
  getDocumentNode(documentID) {
    return axios
      .get(`${this.baseUrl}?document=${documentID}&depth=1`, this.config)
      .then(response => {
        return response.data.results[0];
      });
  }
  getChildren(nodeID) {
    return axios.get(`${this.baseUrl}${nodeID}`, this.config).then(response => {
      return response.data.children;
    });
  }
}

export const nodeResource = new NodeResource("node");

class JudgmentResource extends Resource {
  submitJudgment(node1, node2, rating, confidence, uiName, extraFields) {
    return axios.post(
      this.baseUrl,
      {
        node1,
        node2,
        rating,
        confidence,
        ui_name: uiName,
        ui_version_hash: __webpack_hash__,
        mode: "rapid_feedback",
        extra_fields: {
          ...extraFields,
          is_dev_build: process.env.NODE_ENV !== "production"
        }
      },
      this.config
    );
  }
}

export const judgmentResource = new JudgmentResource("judgment");

class RecommendedNodesResource extends Resource {
  getRecommendedNodes(nodeID, model = "tf_idf_sample_negs_no_training") {
    return axios
      .get(`${this.baseUrl}?target=${nodeID}&model=${model}`, this.config)
      .then(response => {
        return response.data;
      });
  }
}

export const recommendedNodesResource = new RecommendedNodesResource(
  "recommend"
);

class ModelResource extends Resource {
  getModels() {
    return axios.get(`${this.baseUrl}`, this.config).then(response => {
      return response.data;
    });
  }
}
export const modelResource = new ModelResource("model");

class CurriculumDocReviewResource extends Resource {
    getRandomDocTopicForReview() {
      return axios.get(`${this.baseUrl}`, this.config).then(response => {
        return response.data;
      });
    }

    submitReview(section_id, section_text) {
      return axios.post(
        this.baseUrl, {
          section_id: section_id,
          section_text: section_text
        },
        this.config
      );
    }
}

export const curriculumDocReviewResource = new CurriculumDocReviewResource("section-review");
