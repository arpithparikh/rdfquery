/*
 * jquery.hcard.vcard.js unit tests
 */
(function ($){

	var ns = { namespaces: { v: "http://www.w3.org/2006/vcard/ns#" }}, 
    v = $.uri("http://www.w3.org/2006/vcard/ns#"),
    vCardClass = $.rdf.resource('<' + v + 'Vcard>');

	function setup(content) {
		$('#main').html(content);
	}

	function teardown() {
		$('#main > *').remove();
	}

	function testTriples(received, expected) {
		var i, triples = received.databank.triples();
		equals(triples.length, expected.length, 'there should be ' + expected.length + ' triples');
		for (i = 0; i < expected.length; i += 1) {
			equals(triples[i], expected[i]);
		}
	}


	module("Gleaning RDF triples with $.fn.rdf()");


	test("from an element without any hcard", function () {
		setup('<p>This is just a paragraph</p>');
		testTriples($('#main > p').rdf(), []);
		teardown();
	});


	test("from the simplest element with a class='vcard'", function () {
		setup('<span class="vcard"></span>');
    	var x = $.rdf.triple($.rdf.blank('[]'), $.rdf.type, vCardClass)
    	var q = $('#main > span').rdf();
    	q = q.where('?vcard a '+vCardClass);
		equals(q.length, 1, "there should one vcard");
		teardown();
	});


	test("from the simplest element with a class='vcard'", function () {
		setup('<span class="vcard"><a class="fn" href="http://irs.gov/">Internal Revenue Service</a></span>');

		var blank = $.rdf.blank('[]');
    	var x = $.rdf.triple(blank, $.rdf.type, vCardClass);
    	var y = $.rdf.triple(blank, $.rdf.resource('<'+v+'n>'), $.rdf.literal('"Internal Revenue Service"'));
    	var q = $('#main > span').rdf();
    	q = q.where('?vcard a '+vCardClass);
		equals(q.length, 1, "there should one vcard");
		q = q.where('?vcard v:fn "Internal Revenue Service"');
		equals(q.length, 1, "there should be one literal with a specific value");
		teardown();
	});



	test("from fn with another class second", function () {
		setup('<span class="vcard"><a class="fn foo" href="http://irs.gov/">Internal Revenue Service</a></span>');

		var blank = $.rdf.blank('[]');
    	var x = $.rdf.triple(blank, $.rdf.type, vCardClass);
    	var y = $.rdf.triple(blank, $.rdf.resource('<'+v+'n>'), $.rdf.literal('"Internal Revenue Service"'));
    	var q = $('#main > span').rdf();
    	q = q.where('?vcard a '+vCardClass);
		equals(q.length, 1, "there should one vcard");
		q = q.where('?vcard v:fn "Internal Revenue Service"');
		equals(q.length, 1, "there should be one literal with a specific value");
		teardown();
	});



	test("from fn with another class first", function () {
		setup('<span class="vcard"><a class="foo fn" href="http://irs.gov/">Internal Revenue Service</a></span>');

		var blank = $.rdf.blank('[]');
    	var x = $.rdf.triple(blank, $.rdf.type, vCardClass);
    	var y = $.rdf.triple(blank, $.rdf.resource('<'+v+'n>'), $.rdf.literal('"Internal Revenue Service"'));
    	var q = $('#main > span').rdf();

    	q = q.where('?vcard a '+vCardClass);

		equals(q.length, 1, "there should one vcard");
		q = q.where('?vcard v:fn "Internal Revenue Service"');
		equals(q.length, 1, "there should be one literal with a specific value");
		teardown();
	});


	test("from fn with another class first and last", function () {
		setup('<span class="vcard"><a class="foo fn bar" href="http://irs.gov/">Internal Revenue Service</a></span>');

		var blank = $.rdf.blank('[]');
    	var x = $.rdf.triple(blank, $.rdf.type, vCardClass);
    	var y = $.rdf.triple(blank, $.rdf.resource('<'+v+'n>'), $.rdf.literal('"Internal Revenue Service"'));
    	var q = $('#main > span').rdf();
    	q = q.where('?vcard a '+vCardClass);
		equals(q.length, 1, "there should one vcard");
		q = q.where('?vcard v:fn "Internal Revenue Service"');
		equals(q.length, 1, "there should be one literal with a specific value");
		teardown();
	});


	test("from implied name node with given-name", function () {
		setup('<span class="vcard"><a class="fn given-name">John</a></span>');

		var blankVC = $.rdf.blank('[]');
		var blankN = $.rdf.blank('[]');

    	var x = $.rdf.triple(blankVC, $.rdf.type, vCardClass);
    	var z = $.rdf.triple(blankN, $.rdf.type, '<' + v + 'Name>');
    	var y = $.rdf.triple(blankN, $.rdf.resource('<'+v+'given-name>'), $.rdf.literal('"John"'));
    	var q = $('#main > span').rdf();
    	q = q.where('?vcard a '+vCardClass);
		equals(q.length, 1, 'there should be one Vcard');
    	q = q.where('?name a v:Name');
		equals(q.length, 1, 'there should be one Name');
		q = q.where('?vcard v:fn "John"');
		equals(q.length, 1, 'there should be one literal with fn and a specific value');

		q = q.where('?name v:given-name "John"');
		equals(q.length, 1, 'there should be one literal with given-name and a specific value');		
		teardown();
	});


/*

testcases: http://microformats.org/tests/hcard/

*/


	test("from url and fn with org: 01-tantek-basic", function () {
		setup('<div class="vcard"><a class="url fn" href="http://tantek.com/">Tantek Çelik</a><div class="org">Technorati</div></div>');

    	var q = $('#main > div').rdf();
    	q = q.where('?vcard a v:Vcard');
		equals(q.length, 1, 'there should be one Vcard');
    	q = q.where('?vcard v:url <http://tantek.com/>');
		equals(q.length, 1, 'there should be one url');
    	q = q.where('?vcard v:fn "Tantek Çelik"');
		equals(q.length, 1, 'there should be one fn');
    	q = q.where('?vcard v:org ?org');
		equals(q.length, 1, 'there should be one org');
    	q = q.where('?org a v:Organization');
		equals(q.length, 1, 'there should be one type v:Organization');		
    	q = q.where('?org v:organization-name "Technorati"');
		equals(q.length, 1, 'there should be one org name');	
    	q = q.databank.triples();
		equals(q.length, 6, 'Six triples all together');
		teardown();
	});


	test("multiple vcards: 02-multiple-class-names-on-vcard", function () {
		setup('<div class="vcard"><span class="fn n"><span class="given-name">Ryan</span> <span class="family-name">King</span></span></div><p><span class="attendee vcard"><span class="fn n"><span class="given-name">Ryan</span> <span class="family-name">King</span></span></span></p><address class="vcard author"><span class="fn n"><span class="given-name">Ryan</span><span class="family-name">King</span></span></address><ul><li class="reviewer vcard first"><span class="fn n"><span class="given-name">Ryan</span><span class="family-name">King</span></span></li></ul>');

    	var q = $('#main > div').rdf();
    	q = q.where('?vcard a v:Vcard');
		equals(q.length, 4, 'there should be four Vcards');
		teardown();
	});

	test("multiple vcards and implied n 03-implied-n", function () {
		setup('<p class="vcard"><span class="fn">Ryan King</span></p><p class="vcard"><abbr class="fn" title="Ryan King">me</abbr></p><p class="vcard"><img src="/me.jpg" title="Brian Suda" alt="Ryan King" class="fn" /></p><p class="vcard"><a class="fn" href="http://suda.co.uk/">Brian Suda</a></p><p class="vcard"><span class="fn">King, Ryan</span></p><p class="vcard"><span class="fn">King, R</span></p><p class="vcard"><span class="fn">King R</span></p><p class="vcard"><span class="fn">King R.</span></p><p class="vcard"><span class="fn">Jesse James Garrett</span></p><p class="vcard"><span class="fn">Thomas Vander Wal</span></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard a v:Vcard');
		equals(q.length, 10, 'there should be ten Vcards');
		teardown();
	});


	test("text that should be ignored 04-ignore-unknowns", function () {
		setup('<p class="vcard"><span class="ignore-me">Some text that shouldn\'t be in the vCard.</span><span class="fn n"><span class="given-name">Ryan</span> <span class="family-name">King</span></span></p><p class="ignore-me-too">Some more text that shouldn\'t be in the vCard.</p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard a v:Vcard');
		equals(q.length, 1, 'there should be one Vcard');
		teardown();
	});


	test("fn should be the text node (with implied-n-optimization) and 'email' should be the href (not removing scheme as in orginal test, as this is for RDF not for vcard): 05-mailto-1", function () {
	
	setup('<p class="vcard"><a class="fn email" href="mailto:ryan@technorati.com">Ryan King</a></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:email <mailto:ryan@technorati.com>');
		equals(q.length, 1, 'email and implied-n-optimization');
		teardown();
	});


	test("ignore the parameters on the addr-spec: 06-mailto-2", function () {
	
	setup('<p class="vcard"><a class="fn email" href="mailto:brian@example.com?subject=foo">Brian Suda</a></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:email <mailto:brian@example.com>');
		equals(q.length, 1, 'ignore the parameters on the addr-spec');
		teardown();
	});


	test("local url for homepage 07-relative-url", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><a class="url" href="/home/blah">my website</a></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url <'+$.uri.base()+'/home/blah>');
		equals(q.length, 1, 'local url for homepage');
		teardown();
	});


	test("local url for homepage with base element in head: 08-relative-url-base", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><a class="url" href="/home/blah">my website</a></p>');

        var h = document.getElementsByTagName('head');
        var base = document.createElement('base');
        base.setAttribute('href','http://example.com/');
        h[0].appendChild(base);

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url <http://example.com/home/blah>');
		equals(q.length, 1, 'local url for homepage with base');
		teardown();
	});


	test("local url for homepage with base as xml:base on html element: 09-relative-url-xmlbase-1", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><a class="url" href="/home/blah">my website</a></p>');

        var h = document.getElementsByTagName('html');
        h[0].setAttributeNS('http://www.w3.org/XML/1998/namespace','base','http://example.com/');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url <http://example.com/home/blah>');
		equals(q.length, 1, 'local url for homepage with base');
		teardown();
	});


	test("local url for homepage with base as xml:base on body element: 10-relative-url-xmlbase-2", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><a class="url" href="/home/blah">my website</a></p>');

        var h = document.getElementsByTagName('body');
        h[0].setAttributeNS('http://www.w3.org/XML/1998/namespace','base','http://example.com/');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url <http://example.com/home/blah>');
		equals(q.length, 1, 'local url for homepage with base');
		teardown();
	});
	

	test("multiple url elements: 11-multiple-urls.html", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><a class="url" href="http://example.com/foo">my website</a><a class="url" href="http://example.com/bar">my other website</a></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url ?url');
		equals(q.length, 2, '2 urls');
		teardown();
	});

    
	test("url: take the @src, ignore the @type: 12-img-src-url", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><img class="url" src="http://example.org/picture.png" type="image/png" /></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url <http://example.org/picture.png>');
		equals(q.length, 1, 'take the @src, ignore the @type');
		teardown();
	});


	test("photo / logo: take the @src, ignore the @type: 13-photo-logo", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><img class="photo logo" src="http://example.org/picture.png" type="image/png" /></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:photo <http://example.org/picture.png>');
		equals(q.length, 1, 'photo: take the @src, ignore the @type');
    	q = q.where('?vcard v:logo <http://example.org/picture.png>');
		equals(q.length, 1, 'logo: take the @src, ignore the @type');
		teardown();
	});


	test("data url: 14-img-src-data-url", function () {

    var data="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAASUExURf///8zMzJmZmWZmZjMzMwAAAPOPemkAAAM1SURBVHjaYmBgYGBkYQUBFkYWFiCPCchixQAMCCZAACF0MAMVM4K4TFh0IGsBCCAkOxhYmBnAAKaHhZkZmxaAAGJgYIbpYGBihGgBWsTMzMwE4jIhaWGAYoAAYmCECDExYAcwGxkg5oNIgABigDqLARdgZmGB2wICrKwAAcSA3xKgIxlZ0PwCEEAMBCxhgHoWSQtAADFAAxgfYEJ1GEAAQbQw4tUCsocBYQVAADEgu4uRkREeUCwszEwwLhOKLQABhNDCBA4aSDgwwhIAJKqYUPwCEEAMUK/AUwnc9aywJMCI7DAgAAggBohZ8JTBhGIJzCoWZL8ABBCYidAB8RUjWppkYUG2BSCAGMDqEMZiswUtXgACiAHsFYixTMywGGLGpgUWYgABxAA2mQkWCMyMqFoYmdD8ACQAAogBHJHMrCxg1cyIiICmCkYWDFsAAgiihYmZCewFFpR0BfI3LLch+QUggBiQ0iQjEyMDmh54qCBlUIAAYsCRJsElADQvgWKTlRGeKwECiAF3XgGmMEYQYADZzcoA9z5AAMG9RQCAtEC9DxBADFiyFyMjVi0wABBAWLQwQdIiuhYGWJIACCBg+KKUJ9BoBRdS2LQALQMIIGDQIEmwAO1kYcVWHCDZAhBAqFqYmOAxj2YNtAwDAYAAYmDEiBYWzHKKkRERYiwAAYSphZEZwxZGZiZQVEJTJkAAMTCyokc7M5oORlC5wcoEjxeAAAJqQXU0UB6W5WFmABMtEzMi1wEEEFAbE0YyAUuzMMEsYQalMkQSBQggUDmNPU3C9IA4LCxI+QUggEBiKOU8yExgqccCL3chnkPKlQABhGo6ejHBDKmdUHMlQAAhhQvQaGZGkBIkjcAMywLmI+VKgABCSowsTJhZkhlWXiBpAQggYBqBZl9GVOdBcz0LZqEEEEAMqLULMBLg1THWog9IAwQQA0qiZcRW5aPbAhBADCg1El4tMAAQQAxoiZYZXnTh1AIQQAzo2QlYpDDjcBgrxGEAAcSAJTthswmiBUwDBBC2GpkZJTaRvQ+mAQKIAUuuxdZWQvILQABBmSxMjBj5EpcWgACCMoFOYYSpZyHQHgMIMACt2hmoVEikCQAAAABJRU5ErkJggg==";
	
	setup('<p class="vcard"><span class="fn n"><span class="given-name">John</span> <span class="family-name">Doe</span></span><img class="photo logo" src="'+data+'"/></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:photo <'+data+'>');
		equals(q.length, 1, 'photo: data url');
    	q = q.where('?vcard v:logo <'+data+'>');
		equals(q.length, 1, 'logo: data url');
		teardown();
	});




	test("fn concatination of prefix and suffix: 15-honorific-additional-single", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="honorific-prefix">Mr.</span> <span class="given-name">John</span> <span class="additional-name">Maurice</span> <span class="family-name">Doe</span>, <span class="honorific-suffix">Ph.D.</span></span></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:fn "Mr. John Maurice Doe, Ph.D."');
		equals(q.length, 1, 'fn concatination of prefix and suffix');
		teardown();
	});


	test("fn concatination of prefix and suffix: 16-honorific-additional-multiple", function () {
	
	setup('<p class="vcard"><span class="fn n"><span class="honorific-prefix">Mr.</span> <span class="honorific-prefix">Dr.</span> <span class="given-name">John</span> <span class="additional-name">Maurice</span> <span class="additional-name">Benjamin</span> <span class="family-name">Doe</span> <span class="honorific-suffix">Ph.D.</span>, <span class="honorific-suffix">J.D.</span></span></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:fn "Mr. Dr. John Maurice Benjamin Doe Ph.D., J.D."');
		equals(q.length, 1, 'fn concatination of prefix and suffix');
		teardown();
	});



	test("email not uri: 16-honorific-additional-multiple", function () {
	
	setup('<p class="vcard"><span class="fn">John Doe</span><span class="email">john@example.com</span></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:email <mailto:john@example.com>');
		equals(q.length, 1, 'email not uri');
		teardown();
	});


	test("object / data url, photo, logo: 18-object-data-http-uri", function () {
	
	setup('<p class="vcard"><span class="fn">John Doe</span><object class="url photo logo" data="http://example.com/foo.png" type="image/png"></object></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:url <http://example.com/foo.png>');
		equals(q.length, 1, 'one url');
    	q = q.where('?vcard v:photo <http://example.com/foo.png>');
		equals(q.length, 1, 'one photo');
    	q = q.where('?vcard v:logo <http://example.com/foo.png>');
		equals(q.length, 1, 'one logo');		
		teardown();
	});


	test("object / data, photo, logo: 19-object-data-data-uri", function () {
	
    var data='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAASUExURf///8zMzJmZmWZmZjMzMwAAAPOPemkAAAM1SURBVHjaYmBgYGBkYQUBFkYWFiCPCchixQAMCCZAACF0MAMVM4K4TFh0IGsBCCAkOxhYmBnAAKaHhZkZmxaAAGJgYIbpYGBihGgBWsTMzMwE4jIhaWGAYoAAYmCECDExYAcwGxkg5oNIgABigDqLARdgZmGB2wICrKwAAcSA3xKgIxlZ0PwCEEAMBCxhgHoWSQtAADFAAxgfYEJ1GEAAQbQw4tUCsocBYQVAADEgu4uRkREeUCwszEwwLhOKLQABhNDCBA4aSDgwwhIAJKqYUPwCEEAMUK/AUwnc9aywJMCI7DAgAAggBohZ8JTBhGIJzCoWZL8ABBCYidAB8RUjWppkYUG2BSCAGMDqEMZiswUtXgACiAHsFYixTMywGGLGpgUWYgABxAA2mQkWCMyMqFoYmdD8ACQAAogBHJHMrCxg1cyIiICmCkYWDFsAAgiihYmZCewFFpR0BfI3LLch+QUggBiQ0iQjEyMDmh54qCBlUIAAYsCRJsElADQvgWKTlRGeKwECiAF3XgGmMEYQYADZzcoA9z5AAMG9RQCAtEC9DxBADFiyFyMjVi0wABBAWLQwQdIiuhYGWJIACCBg+KKUJ9BoBRdS2LQALQMIIGDQIEmwAO1kYcVWHCDZAhBAqFqYmOAxj2YNtAwDAYAAYmDEiBYWzHKKkRERYiwAAYSphZEZwxZGZiZQVEJTJkAAMTCyokc7M5oORlC5wcoEjxeAAAJqQXU0UB6W5WFmABMtEzMi1wEEEFAbE0YyAUuzMMEsYQalMkQSBQggUDmNPU3C9IA4LCxI+QUggEBiKOU8yExgqccCL3chnkPKlQABhGo6ejHBDKmdUHMlQAAhhQvQaGZGkBIkjcAMywLmI+VKgABCSowsTJhZkhlWXiBpAQggYBqBZl9GVOdBcz0LZqEEEEAMqLULMBLg1THWog9IAwQQA0qiZcRW5aPbAhBADCg1El4tMAAQQAxoiZYZXnTh1AIQQAzo2QlYpDDjcBgrxGEAAcSAJTthswmiBUwDBBC2GpkZJTaRvQ+mAQKIAUuuxdZWQvILQABBmSxMjBj5EpcWgACCMoFOYYSpZyHQHgMIMACt2hmoVEikCQAAAABJRU5ErkJggg==';

	setup('<p class="vcard"><span class="fn">John Doe</span><object class="photo logo" data="'+data+'" /></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:photo <' + data + '>');
		equals(q.length, 1, 'one data photo');
    	q = q.where('?vcard v:logo  <' + data + '>');
		equals(q.length, 1, 'one data logo');		
		teardown();
	});



	test("only testing 'fn' here, but you should be able to parse any text value out of the img@alt: 20-image-alt", function () {
	
	setup('<p class="vcard"><img class="fn photo logo" src="http://example.com/foo.png" alt="John Doe" /></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:fn "John Doe"');
		equals(q.length, 1, 'parse fn from alt text');
		teardown();
	});



	test("various tel: 21-tel(1)", function () {
	
	setup('<div class="vcard"><p class="fn">John Doe</p><p class="tel">+1.415.555.1231</p></div>');

    	var q = $('#main > div').rdf();
    	q = q.where('?vcard v:tel <tel:+1.415.555.1231>');
		equals(q.length, 1, '1 tel as text value');
		teardown();
	});

	test("various tel: 21-tel(2)", function () {
	
	setup('<div class="vcard"><p class="fn">John Doe</p><p class="tel"><span class="type">home</span><span class="value">+1 415 555 1232</span></p></div>');

    	var q = $('#main > div').rdf();
    	q = q.where('?vcard v:homeTel <tel:+1 415 555 1232>');
		equals(q.length, 1, '1 tel as span text value');
		teardown();
	});


	test("various tel: 21-tel(3)", function () {
	
	setup('<div class="vcard"><div class="tel">types:<ul><li class="type">msg</li><li class="type">home</li><li class="type">work</li><li class="type">pref</li><li class="type">voice</li><li class="type">fax</li><li class="type">cell</li><li class="type">video</li><li class="type">pager</li><li class="type">bbs</li><li class="type">car</li><li class="type">isdn</li><li class="type">pcs</li></ul><span class="value">+1</span><span class="value">415</span><span class="value">555</span><span class="value">1233</span></div></div>');
	
    	var q = $('#main > div').rdf();
    	q = q.where('?vcard v:tel <tel:+14155551233>');
		equals(q.length, 1, '1 tel as text value');
    	q = q.where('?vcard v:homeTel <tel:+14155551233>');
		equals(q.length, 1, '1 home tel as text value');
    	q = q.where('?vcard v:workTel <tel:+14155551233>');
		equals(q.length, 1, '1 work tel as text value');	
    	q = q.where('?vcard v:fax <tel:+14155551233>');
		equals(q.length, 1, '1 fax as text value');	
    	q = q.where('?vcard v:mobileTel <tel:+14155551233>');
		equals(q.length, 1, '1 mobile tel as text value');

		teardown();
	});


	test("various tel: 21-tel(4)", function () {
	
	setup('<div class="vcard"><p class="tel"><abbr class="type" title="home">H</abbr><span class="value">+1 415 555 1234</span></p><a class="tel" href="tel:+1.415.555.1235">call me1</a><object class="tel" data="tel:+1.415.555.1236">call me</object><area class="tel" href="tel:+1.415.555.1237">call me2</area><a class="tel" href="fax:+1.415.555.1238">call me6</a><object class="tel" data="fax:+1.415.555.1239">call me3</object><area class="tel" href="fax:+1.415.555.1240">call me4</area><a class="tel" href="modem:+1.415.555.1241">call me5</a><object class="tel" data="modem:+1.415.555.1242">call me</object><area class="tel" href="modem:+1.415.555.1243">call me</area></div>');

    	var q = $('#main > div').rdf();


    	q = q.where('?vcard v:homeTel <tel:+1 415 555 1234>');
		equals(q.length, 1, '1 home tel as class value');

    	q = q.where('?vcard v:tel <tel:+1.415.555.1235>');
		equals(q.length, 1, '1 tel as href');

    	q = q.where('?vcard v:tel <tel:+1.415.555.1236>');
		equals(q.length, 1, '1 tel as data value');	

    	q = q.where('?vcard v:tel <tel:+1.415.555.1238>');
		equals(q.length, 1, '1 fax as href');	

    	q = q.where('?vcard v:tel <tel:+1.415.555.1239>');
		equals(q.length, 1, '1 data as data');	
			
    	q = q.where('?vcard v:tel <tel:+1.415.555.1241>');
		equals(q.length, 1, '1 fax as href');	

    	q = q.where('?vcard v:tel <tel:+1.415.555.1242>');
		equals(q.length, 1, '1 data as data');	

// note that it just does't like <area for some reason

		teardown();
	});



	test("adresses: 22-adr", function () {
	
	setup('<div class="vcard"><span class="type">home</span> <p class="fn">John Doe</p><p class="adr"><span class="street-address">1231 Main St.</span><span class="locality">Beverly Hills</span><span class="region">California</span><span class="country-name">United States of America</span><span class="postal-code">90210</span></p></div> ');

    	var q = $('#main').rdf();
    	q = q.where('?adr a <http://www.w3.org/2006/vcard/ns#Address>');
		equals(q.length, 1, 'one Address url');
		teardown();
	});


	test("most annoying test ever: 23-abbr-title-everything", function () {
	
	setup('<p class="vcard"><abbr class="fn" title="John Doe">foo</abbr><span class="n"><abbr class="honorific-prefix" title="Mister">Mr.</abbr><abbr class="given-name" title="Jonathan">John</abbr> <abbr class="additional-name" title="John">J</abbr> <abbr class="family-name" title="Doe-Smith">Doe</abbr> <abbr class="honorific-suffix" title="Medical Doctor">M.D</abbr></span> <abbr class="nickname" title="JJ">jj</abbr> <abbr class="bday" title="2006-04-04">April 4, 2006</abbr> <span class="adr"> <abbr class="post-office-box" title="Box 1234">B. 1234</abbr> <abbr class="extended-address" title="Suite 100">Ste. 100</abbr> <abbr class="street-address" title="123 Fake Street">123 Fake St.</abbr> <abbr class="locality" title="San Francisco">San Fran</abbr> <abbr class="region" title="California">CA</abbr> <abbr class="postal-code" title="12345-6789">12345</abbr> <abbr class="country-name" title="United States of America">USA</abbr> <abbr class="type" title="work">workplace</abbr></span> <abbr class="tel" title="415.555.1234">1234</abbr> <abbr class="tel-type-value" title="work">workplace</abbr> <abbr class="tz" title="-0700">Pacific Time</abbr> <span class="geo"><abbr class="latitude" title="37.77">Northern</abbr> <abbr class="longitude" title="-122.41">California</abbr></span> <abbr class="title" title="President">pres.</abbr> and <abbr class="role" title="Chief">cat wrangler</abbr> <span class="org"> <abbr class="organization-name" title="Intellicorp">foo</abbr> <abbr class="organization-unit" title="Intelligence">bar</abbr> </span> <abbr class="note" title="this is a note">this is not a note</abbr> <abbr class="uid" title="abcdefghijklmnopqrstuvwxyz">alpha</abbr> <abbr class="class" title="public">pub</abbr></p>');

    	var result = $('#main').rdf();
		equals(result.databank.triples().length, 31, '31 triples');
		teardown();

	});


	test("geo abbrievation: 25-geo-abbr", function () {
	
	setup('<p class="vcard"> <abbr class="geo" title="30.267991;-97.739568"><span class="fn org">Paradise</span></abbr></p>');

    	var q = $('#main').rdf();
    	q = q.where('?vcard v:latitude "30.267991"');
		equals(q.length, 1, 'lat 1');
    	q = q.where('?vcard v:longitude "-97.739568"');
		equals(q.length, 1, 'long 1');
    	q = q.where('?org a <'+v+'Organization>');
		equals(q.length, 1, 'one node of type org');
    	q = q.where('?vcard <'+v+'fn> "Paradise"');
		equals(q.length, 1, 'one fn');
		teardown();
	});


/* more tests to come */





})(jQuery);
