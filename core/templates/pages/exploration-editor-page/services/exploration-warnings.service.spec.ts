// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for ExplorationWarningsService.
 */

import { fakeAsync } from '@angular/core/testing';

import { AnswerStats } from 'domain/exploration/answer-stats.model';
import { StateTopAnswersStats } from
  'domain/statistics/state-top-answers-stats-object.factory';

// TODO(#7222): Remove the following block of unnnecessary imports once
// exploration-editor-tab.directive.ts is upgraded to Angular 8.
import { AngularNameService } from
  'pages/exploration-editor-page/services/angular-name.service';
import { AnswerGroupObjectFactory } from
  'domain/exploration/AnswerGroupObjectFactory';
import { ExplorationFeaturesService } from
  'services/exploration-features.service';
import { FractionObjectFactory } from 'domain/objects/FractionObjectFactory';
import { HintObjectFactory } from 'domain/exploration/HintObjectFactory';
import { ImprovementsService } from 'services/improvements.service';
import { OutcomeObjectFactory } from
  'domain/exploration/OutcomeObjectFactory';
import { ParamChangeObjectFactory } from
  'domain/exploration/ParamChangeObjectFactory';
import { ParamChangesObjectFactory } from
  'domain/exploration/ParamChangesObjectFactory';
import { RuleObjectFactory } from 'domain/exploration/RuleObjectFactory';
import { SolutionValidityService } from
  'pages/exploration-editor-page/editor-tab/services/solution-validity.service';
import { StateClassifierMappingService } from
  'pages/exploration-player-page/services/state-classifier-mapping.service';
import { StateEditorService } from 'components/state-editor/state-editor-properties-services/state-editor.service';
import { UnitsObjectFactory } from 'domain/objects/UnitsObjectFactory';
import { WrittenTranslationObjectFactory } from
  'domain/exploration/WrittenTranslationObjectFactory';
import { WrittenTranslationsObjectFactory } from
  'domain/exploration/WrittenTranslationsObjectFactory';
// TODO(#7222): Remove the following block of unnnecessary imports once
// the code corresponding to the spec is upgraded to Angular 8.
import { importAllAngularServices } from 'tests/unit-test-utils';
import { StateObjectsBackendDict } from 'domain/exploration/StatesObjectFactory';
// ^^^ This block is to be removed.

require('pages/exploration-editor-page/services/graph-data.service');
require('pages/exploration-editor-page/services/exploration-property.service');
require(
  'pages/exploration-editor-page/services/exploration-init-state-name.service');

describe('Exploration Warnings Service', function() {
  var ExplorationWarningsService = null;
  var ExplorationStatesService = null;
  var StateTopAnswersStatsService = null;
  var StateTopAnswersStatsBackendApiService = null;

  beforeEach(angular.mock.module('oppia'));

  importAllAngularServices();

  beforeEach(angular.mock.module('oppia', function($provide) {
    $provide.value('AngularNameService', new AngularNameService());
    $provide.value(
      'AnswerGroupObjectFactory', new AnswerGroupObjectFactory(
        new OutcomeObjectFactory(),
        new RuleObjectFactory()));
    $provide.value(
      'ExplorationFeaturesService', new ExplorationFeaturesService());
    $provide.value('FractionObjectFactory', new FractionObjectFactory());
    $provide.value(
      'HintObjectFactory', new HintObjectFactory());
    $provide.value('ImprovementsService', new ImprovementsService());
    $provide.value(
      'OutcomeObjectFactory', new OutcomeObjectFactory());
    $provide.value(
      'ParamChangeObjectFactory', new ParamChangeObjectFactory());
    $provide.value(
      'ParamChangesObjectFactory', new ParamChangesObjectFactory(
        new ParamChangeObjectFactory()));
    $provide.value('RuleObjectFactory', new RuleObjectFactory());
    $provide.value('SolutionValidityService', new SolutionValidityService());
    $provide.value(
      'StateClassifierMappingService', new StateClassifierMappingService());
    $provide.value(
      'StateEditorService', new StateEditorService(
        new SolutionValidityService()));
    $provide.value('UnitsObjectFactory', new UnitsObjectFactory());
    $provide.value(
      'WrittenTranslationObjectFactory',
      new WrittenTranslationObjectFactory());
    $provide.value(
      'WrittenTranslationsObjectFactory',
      new WrittenTranslationsObjectFactory(
        new WrittenTranslationObjectFactory()));
  }));

  describe('when exploration param changes has jinja values', function() {
    beforeEach(angular.mock.module('oppia', function($provide) {
      $provide.value('ExplorationInitStateNameService', {
        savedMemento: 'Hola'
      });
      $provide.value('ExplorationParamChangesService', {
        savedMemento: [{
          customizationArgs: {
            parse_with_jinja: false,
            value: '5'
          },
          generatorId: 'Copier',
          name: 'ParamChange1'
        }, {
          customizationArgs: {
            parse_with_jinja: true,
            value: '{{ParamChange2}}'
          },
          generatorId: 'Copier',
        }, {
          customizationArgs: {
            parse_with_jinja: true,
            value: '5'
          },
          generatorId: 'RandomSelector',
          name: 'ParamChange3'
        }]
      });
    }));
    beforeEach(angular.mock.inject(function($injector) {
      ExplorationWarningsService = $injector.get('ExplorationWarningsService');
      ExplorationStatesService = $injector.get('ExplorationStatesService');
      StateTopAnswersStatsBackendApiService = $injector.get(
        'StateTopAnswersStatsBackendApiService');
      StateTopAnswersStatsService = $injector.get(
        'StateTopAnswersStatsService');
    }));

    it('should update warnings with TextInput as interaction id', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            content_id: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: 'TextInput',
            answer_groups: [{
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }],
            default_outcome: {
              dest: 'Hola',
              feedback: {
                content_id: '',
                html: '',
              },
            },
            customization_args: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is' +
        ' set before it is referred to in the initial list of parameter' +
        ' changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.hasCriticalWarnings())
        .toBe(true);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings with Continue as interaction id', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            content_id: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: 'Continue',
            answer_groups: [{
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }, {
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }],
            default_outcome: {
              dest: 'Hola',
              feedback: {
                content_id: '',
                html: '',
              },
            },
            customization_args: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              },
              buttonText: {
                value: {
                  unicode_str: '',
                  content_id: ''
                }
              }
            },
            hints: [],
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer groups have classifiers' +
        ' with no training data: 0, 1'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.hasCriticalWarnings())
        .toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'The button text should not be empty.',
          'Only the default outcome is necessary for a continue interaction.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings when no interaction id is provided', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            content_id: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: null,
            answer_groups: [{
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }],
            default_outcome: {
              dest: 'Hola',
              feedback: {
                content_id: '',
                html: '',
              },
            },
            customization_args: {},
            hints: [],
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Please add an interaction to this card.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings when there is a solution in the interaction',
      function() {
        ExplorationStatesService.init({
          Hola: {
            content: {
              content_id: 'content',
              html: '{{HtmlValue}}'
            },
            recorded_voiceovers: {
              voiceovers_mapping: {},
            },
            param_changes: [],
            interaction: {
              id: 'TextInput',
              solution: {
                correct_answer: 'This is the correct answer',
                answer_is_exclusive: false,
                explanation: {
                  html: 'Solution explanation'
                }
              },
              answer_groups: [{
                outcome: {
                  dest: '',
                  feedback: {
                    content_id: 'feedback_1',
                    html: ''
                  },
                },
                rule_specs: [],
                training_data: []
              }],
              default_outcome: {
                dest: 'Hola',
                feedback: {
                  content_id: '',
                  html: '',
                },
              },
              customization_args: {
                rows: {
                  value: true
                },
                placeholder: {
                  value: 1
                }
              },
              hints: [],
            },
            written_translations: {
              translations_mapping: {
                content: {},
                default_outcome: {},
              },
            },
          }
        });
        ExplorationWarningsService.updateWarnings();

        expect(ExplorationWarningsService.getWarnings()).toEqual([{
          type: 'critical',
          message: 'Please ensure the value of parameter "ParamChange2"' +
          ' is set before it is referred to in the initial list of' +
          ' parameter changes.'
        }, {
          type: 'critical',
          message: 'Please ensure the value of parameter "HtmlValue" is set' +
          ' before using it in "Hola".'
        }, {
          type: 'error',
          message: 'The following card has errors: Hola.'
        }, {
          type: 'error',
          message: 'In \'Hola\', the following answer group has a classifier' +
          ' with no training data: 0'
        }]);
        expect(ExplorationWarningsService.countWarnings()).toBe(4);
        expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
        expect(ExplorationWarningsService.getAllStateRelatedWarnings())
          .toEqual({
            Hola: [
              'Placeholder text must be a string.',
              'Number of rows must be integral.',
              'The current solution does not lead to another card.',
              'There\'s no way to complete the exploration starting from' +
              ' this card. To fix this, make sure that the last card in' +
              ' the chain starting from this one has an \'End Exploration\'' +
              ' question type.'
            ]
          });
      });

    it('should update warnings when state top answers stats is initiated',
      fakeAsync(async function() {
        ExplorationStatesService.init({
          Hola: {
            content: {
              content_id: 'content',
              html: '{{HtmlValue}}'
            },
            recorded_voiceovers: {
              voiceovers_mapping: {},
            },
            param_changes: [],
            interaction: {
              id: 'TextInput',
              solution: {
                correct_answer: 'This is the correct answer',
                answer_is_exclusive: false,
                explanation: {
                  html: 'Solution explanation'
                }
              },
              answer_groups: [{
                outcome: {
                  dest: '',
                  feedback: {
                    content_id: 'feedback_1',
                    html: ''
                  },
                },
                rule_specs: [],
                training_data: []
              }],
              default_outcome: {
                dest: 'Hola',
                feedback: {
                  content_id: '',
                  html: '',
                },
              },
              customization_args: {
                rows: {
                  value: true
                },
                placeholder: {
                  value: 1
                }
              },
              hints: [],
            },
            written_translations: {
              translations_mapping: {
                content: {},
                default_outcome: {},
              },
            },
          }
        });
        spyOn(StateTopAnswersStatsBackendApiService, 'fetchStatsAsync')
          .and.returnValue(Promise.resolve(
            new StateTopAnswersStats(
              {Hola: [new AnswerStats('hola', 'hola', 7, false)]},
              {Hola: 'TextInput'})));
        await StateTopAnswersStatsService.initAsync(
          'expId', ExplorationStatesService.getStates());

        ExplorationWarningsService.updateWarnings();

        expect(ExplorationWarningsService.getWarnings()).toEqual([{
          type: 'critical',
          message: 'Please ensure the value of parameter "ParamChange2" is' +
          ' set before it is referred to in the initial list of parameter' +
          ' changes.'
        }, {
          type: 'critical',
          message: 'Please ensure the value of parameter "HtmlValue" is set' +
          ' before using it in "Hola".'
        }, {
          type: 'error',
          message: 'The following card has errors: Hola.'
        }, {
          type: 'error',
          message: 'In \'Hola\', the following answer group has a classifier' +
          ' with no training data: 0'
        }]);
        expect(ExplorationWarningsService.countWarnings()).toBe(4);
        expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
        expect(ExplorationWarningsService.getAllStateRelatedWarnings())
          .toEqual({
            Hola: [
              'Placeholder text must be a string.',
              'Number of rows must be integral.',
              'There is an answer among the top 10 which has no explicit' +
              ' feedback.',
              'The current solution does not lead to another card.',
              'There\'s no way to complete the exploration starting from' +
              ' this card. To fix this, make sure that the last card in' +
              ' the chain starting from this one has an \'End Exploration\'' +
              ' question type.'
            ]
          });
      }));

    it('should update warnings when state name is not equal to the default' +
    ' outcome destination', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            content_id: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: 'TextInput',
            solution: {
              correct_answer: 'This is the correct answer',
              answer_is_exclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            answer_groups: [{
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }],
            default_outcome: {
              dest: 'State',
              feedback: {
                content_id: '',
                html: '',
              },
            },
            customization_args: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings when there are two states but only one saved' +
    ' memento value', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            content_id: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: 'TextInput',
            solution: {
              correct_answer: 'This is the correct answer',
              answer_is_exclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            answer_groups: [{
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }],
            default_outcome: {
              dest: 'Hola',
              feedback: {
                content_id: '',
                html: '',
              },
            },
            customization_args: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
        },
        State: {
          content: {
            content_id: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: 'TextInput',
            solution: {
              correct_answer: 'This is the correct answer',
              answer_is_exclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            answer_groups: [{
              outcome: {
                dest: '',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
              },
              rule_specs: [],
              training_data: []
            }],
            default_outcome: {
              dest: 'State',
              feedback: {
                content_id: '',
                html: '',
              },
            },
            customization_args: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following cards have errors: Hola, State.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }, {
        type: 'error',
        message: 'In \'State\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(5);
      expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'The current solution does not lead to another card.',
        ],
        State: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'The current solution does not lead to another card.',
          'This card is unreachable.'
        ]
      });
    });
  });

  describe('when exploration param changes has no jinja values', function() {
    beforeEach(angular.mock.module('oppia', function($provide) {
      $provide.value('ExplorationInitStateNameService', {
        savedMemento: 'Hola'
      });
      $provide.value('ExplorationParamChangesService', {
        savedMemento: [{
          customizationArgs: {
            parse_with_jinja: true,
            value: ''
          },
          generatorId: 'Copier',
        }]
      });
    }));
    beforeEach(angular.mock.inject(function($injector) {
      ExplorationWarningsService = $injector.get('ExplorationWarningsService');
      ExplorationStatesService = $injector.get('ExplorationStatesService');
    }));

    it('should update warning to an empty array', function() {
      ExplorationStatesService.init(<StateObjectsBackendDict> {
        Hola: {
          content: {
            content_id: 'content',
            html: ''
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          param_changes: [],
          interaction: {
            id: 'TextInput',
            answer_groups: [{
              outcome: {
                dest: 'State',
                feedback: {
                  content_id: 'feedback_1',
                  html: ''
                },
                labelled_as_correct: false,
                missing_prerequisite_skill_id: null,
                refresher_exploration_id: null,
                param_changes: []
              },
              rule_specs: [{
                rule_type: 'Equals',
                inputs: {x: {
                  contentId: 'rule_input',
                  normalizedStrSet: ['10']
                }}
              }],
              training_data: ['1'],
              tagged_skill_misconception_id: null
            }],
            default_outcome: {
              dest: '',
              feedback: {
                content_id: '',
                html: '',
              },
              labelled_as_correct: false,
              missing_prerequisite_skill_id: null,
              refresher_exploration_id: null,
              param_changes: []
            },
            customization_args: {
              rows: {
                value: 1
              },
              placeholder: {
                value: {
                  unicode_str: 'placeholder value',
                  content_id: ''
                }
              }
            },
            hints: [],
            confirmed_unclassified_answers: [],
            solution: {
              answer_is_exclusive: true,
              correct_answer: '10',
              explanation: {
                html: 'placeholder value',
                unicode_str: 'placeholder value',
                content_id: ''
              }
            }
          },
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {},
            },
          },
          classifier_model_id: null,
          solicit_answer_details: false,
          card_is_checkpoint: false,
          next_content_id_index: null,
        },
        State: {
          param_changes: [],
          content: {
            content_id: '',
            html: ''
          },
          recorded_voiceovers: {
            voiceovers_mapping: {
              content: {},
              default_outcome: {}
            }
          },
          interaction: {
            id: 'EndExploration',
            default_outcome: null,
            confirmed_unclassified_answers: [],
            customization_args: {
              recommendedExplorationIds: {
                value: []
              }
            },
            solution: null,
            answer_groups: [],
            hints: []
          },
          solicit_answer_details: false,
          card_is_checkpoint: false,
          written_translations: {
            translations_mapping: {
              content: {},
              default_outcome: {}
            }
          },
          classifier_model_id: null,
          next_content_id_index: null
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([]);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual(
        {});
    });
  });
});
