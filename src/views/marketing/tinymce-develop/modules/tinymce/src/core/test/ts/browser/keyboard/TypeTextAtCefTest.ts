import { GeneralSteps, Keys, Logger, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyActions, TinyApis, TinyLoader } from '@ephox/mcagar';
import { SugarElement } from '@ephox/sugar';
import Theme from 'tinymce/themes/silver/Theme';
import * as TypeText from '../../module/test/TypeText';

UnitTest.asynctest('browser.tinymce.core.keyboard.TypeTextAtCef', (success, failure) => {

  Theme();

  TinyLoader.setupLight((editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);
    const tinyActions = TinyActions(editor);

    Pipeline.async({}, [
      tinyApis.sFocus(),
      Logger.t('Type text before cef inline element', GeneralSteps.sequence([
        tinyApis.sSetContent('<p><span contenteditable="false">a</span></p>'),
        tinyApis.sSelect('p', [ 1 ]),
        tinyActions.sContentKeystroke(Keys.left(), {}),
        TypeText.sTypeContentAtSelection(SugarElement.fromDom(editor.getDoc()), 'bc'),
        tinyApis.sAssertSelection([ 0, 0 ], 2, [ 0, 0 ], 2),
        tinyApis.sAssertContent('<p>bc<span contenteditable="false">a</span></p>')
      ])),
      Logger.t('Type after cef inline element', GeneralSteps.sequence([
        tinyApis.sSetContent('<p><span contenteditable="false">a</span></p>'),
        tinyApis.sSelect('p', [ 1 ]),
        tinyActions.sContentKeystroke(Keys.right(), {}),
        TypeText.sTypeContentAtSelection(SugarElement.fromDom(editor.getDoc()), 'bc'),
        tinyApis.sAssertSelection([ 0, 1 ], 3, [ 0, 1 ], 3),
        tinyApis.sAssertContent('<p><span contenteditable="false">a</span>bc</p>')
      ])),
      Logger.t('Type between cef inline elements', GeneralSteps.sequence([
        tinyApis.sSetContent('<p><span contenteditable="false">a</span>&nbsp;<span contenteditable="false">b</span></p>'),
        tinyApis.sSelect('p', [ 3 ]),
        tinyActions.sContentKeystroke(Keys.left(), {}),
        tinyActions.sContentKeystroke(Keys.left(), {}),
        TypeText.sTypeContentAtSelection(SugarElement.fromDom(editor.getDoc()), 'bc'),
        tinyApis.sAssertSelection([ 0, 1 ], 3, [ 0, 1 ], 3),
        tinyApis.sAssertContent('<p><span contenteditable="false">a</span>bc&nbsp;<span contenteditable="false">b</span></p>')
      ]))
    ], onSuccess, onFailure);
  }, {
    add_unload_trigger: false,
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});